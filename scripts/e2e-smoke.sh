#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
TEST_EMAIL="e2e-$(date +%s)@alliswell.test"
TEST_PASSWORD="testpass123"

echo "==> Registering test user: $TEST_EMAIL"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"E2E Tester\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"examType\":\"JEE\"}")

echo "$REGISTER_RESPONSE" | grep -q '"success":true' || {
  echo "Registration failed: $REGISTER_RESPONSE"
  exit 1
}

echo "==> Fetching CSRF token"
CSRF_JSON=$(curl -s -c /tmp/all-is-well-cookies.txt "$BASE_URL/api/auth/csrf")
CSRF_TOKEN=$(echo "$CSRF_JSON" | sed -n 's/.*"csrfToken":"\([^"]*\)".*/\1/p')

if [ -z "$CSRF_TOKEN" ]; then
  echo "Failed to get CSRF token: $CSRF_JSON"
  exit 1
fi

echo "==> Signing in with credentials"
LOGIN_STATUS=$(curl -s -L -o /tmp/all-is-well-login.txt -w "%{http_code}" -b /tmp/all-is-well-cookies.txt -c /tmp/all-is-well-cookies.txt \
  -X POST "$BASE_URL/api/auth/callback/credentials" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "csrfToken=$CSRF_TOKEN" \
  --data-urlencode "email=$TEST_EMAIL" \
  --data-urlencode "password=$TEST_PASSWORD" \
  --data-urlencode "callbackUrl=$BASE_URL/" \
  --data-urlencode "json=true")

if [ "$LOGIN_STATUS" != "200" ]; then
  echo "Login failed with status $LOGIN_STATUS"
  cat /tmp/all-is-well-login.txt
  exit 1
fi

echo "==> Creating mood check-in"
CHECKIN_RESPONSE=$(curl -s -b /tmp/all-is-well-cookies.txt -X POST "$BASE_URL/api/check-ins" \
  -H "Content-Type: application/json" \
  -d '{"moodScore":7,"energyLevel":6,"stressLevel":4,"triggers":["exam_pressure"],"note":"E2E smoke test"}')

echo "$CHECKIN_RESPONSE" | grep -q '"success":true' || {
  echo "Check-in failed: $CHECKIN_RESPONSE"
  exit 1
}

echo "==> Fetching dashboard stats"
STATS_RESPONSE=$(curl -s -b /tmp/all-is-well-cookies.txt "$BASE_URL/api/check-ins")
echo "$STATS_RESPONSE" | grep -q '"success":true' || {
  echo "Stats fetch failed: $STATS_RESPONSE"
  exit 1
}

echo "==> Fetching insights"
INSIGHTS_RESPONSE=$(curl -s -b /tmp/all-is-well-cookies.txt "$BASE_URL/api/insights?days=7")
echo "$INSIGHTS_RESPONSE" | grep -q '"success":true' || {
  echo "Insights fetch failed: $INSIGHTS_RESPONSE"
  exit 1
}

echo "==> Fetching wellness image"
IMAGE_RESPONSE=$(curl -s -b /tmp/all-is-well-cookies.txt "$BASE_URL/api/media/images?moodScore=7")
echo "$IMAGE_RESPONSE" | grep -q '"success":true' || {
  echo "Image fetch failed: $IMAGE_RESPONSE"
  exit 1
}

echo "==> Fetching meditation videos"
VIDEO_RESPONSE=$(curl -s -b /tmp/all-is-well-cookies.txt "$BASE_URL/api/media/videos?category=meditation")
echo "$VIDEO_RESPONSE" | grep -q '"success":true' || {
  echo "Video fetch failed: $VIDEO_RESPONSE"
  exit 1
}

echo "==> All smoke tests passed"
