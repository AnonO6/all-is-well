#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
COOKIE_JAR="${COOKIE_JAR:-/tmp/all-is-well-cookies.txt}"
TEST_EMAIL="e2e-$(date +%s)@alliswell.test"
TEST_PASSWORD="testpass123"

require_json_success() {
  local label="$1"
  local body="$2"
  echo "$body" | grep -q '"success":true' || {
    echo "$label failed: $body"
    exit 1
  }
}

require_body_contains() {
  local label="$1"
  local body="$2"
  local needle="$3"
  echo "$body" | grep -q "$needle" || {
    echo "$label missing expected content: $needle"
    echo "$body"
    exit 1
  }
}

require_body_not_contains() {
  local label="$1"
  local body="$2"
  local needle="$3"
  if echo "$body" | grep -q "$needle"; then
    echo "$label should not expose: $needle"
    echo "$body"
    exit 1
  fi
}

echo "==> Checking public landing page"
LANDING_BODY=$(curl -s "$BASE_URL/")
LANDING_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/")
if [ "$LANDING_STATUS" != "200" ]; then
  echo "Landing page failed with status $LANDING_STATUS"
  exit 1
fi
require_body_contains "Landing page" "$LANDING_BODY" "ALL IZZ WELL"
require_body_contains "Landing page" "$LANDING_BODY" "Login to continue"
require_body_contains "Landing page" "$LANDING_BODY" "Hume AI"

echo "==> Protected route should redirect unauthenticated users"
DASHBOARD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/dashboard")
if [ "$DASHBOARD_STATUS" != "307" ] && [ "$DASHBOARD_STATUS" != "302" ] && [ "$DASHBOARD_STATUS" != "401" ]; then
  echo "Expected dashboard to require auth, got $DASHBOARD_STATUS"
  exit 1
fi

echo "==> Registering test user: $TEST_EMAIL"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"E2E Tester\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"examType\":\"JEE\"}")
require_json_success "Registration" "$REGISTER_RESPONSE"

echo "==> Fetching CSRF token"
CSRF_JSON=$(curl -s -c "$COOKIE_JAR" "$BASE_URL/api/auth/csrf")
CSRF_TOKEN=$(echo "$CSRF_JSON" | sed -n 's/.*"csrfToken":"\([^"]*\)".*/\1/p')
if [ -z "$CSRF_TOKEN" ]; then
  echo "Failed to get CSRF token: $CSRF_JSON"
  exit 1
fi

echo "==> Signing in with credentials"
LOGIN_STATUS=$(curl -s -L -o /tmp/all-is-well-login.txt -w "%{http_code}" -b "$COOKIE_JAR" -c "$COOKIE_JAR" \
  -X POST "$BASE_URL/api/auth/callback/credentials" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "csrfToken=$CSRF_TOKEN" \
  --data-urlencode "email=$TEST_EMAIL" \
  --data-urlencode "password=$TEST_PASSWORD" \
  --data-urlencode "callbackUrl=$BASE_URL/dashboard" \
  --data-urlencode "json=true")
if [ "$LOGIN_STATUS" != "200" ]; then
  echo "Login failed with status $LOGIN_STATUS"
  cat /tmp/all-is-well-login.txt
  exit 1
fi

echo "==> Creating positive-only mood check-in"
CHECKIN_RESPONSE=$(curl -s -b "$COOKIE_JAR" -X POST "$BASE_URL/api/check-ins" \
  -H "Content-Type: application/json" \
  -d '{"moodScore":7,"energyLevel":6,"positiveHighlights":["study_win"],"note":"E2E smoke test"}')
require_json_success "Check-in" "$CHECKIN_RESPONSE"

echo "==> Rejecting legacy stress payload"
LEGACY_CHECKIN=$(curl -s -b "$COOKIE_JAR" -X POST "$BASE_URL/api/check-ins" \
  -H "Content-Type: application/json" \
  -d '{"moodScore":7,"energyLevel":6,"stressLevel":9,"triggers":["exam_pressure"]}')
if echo "$LEGACY_CHECKIN" | grep -q '"success":true'; then
  echo "Legacy stress payload should be rejected"
  exit 1
fi
require_body_contains "Legacy stress rejection" "$LEGACY_CHECKIN" '"success":false'

echo "==> Fetching dashboard stats"
STATS_RESPONSE=$(curl -s -b "$COOKIE_JAR" "$BASE_URL/api/check-ins")
require_json_success "Dashboard stats" "$STATS_RESPONSE"

echo "==> Fetching positive-only insights"
INSIGHTS_RESPONSE=$(curl -s -b "$COOKIE_JAR" "$BASE_URL/api/insights?days=7")
require_json_success "Insights" "$INSIGHTS_RESPONSE"
require_body_contains "Insights" "$INSIGHTS_RESPONSE" '"positiveBreakdown"'
require_body_contains "Insights" "$INSIGHTS_RESPONSE" '"averageEnergy"'
require_body_not_contains "Insights" "$INSIGHTS_RESPONSE" '"averageStress"'
require_body_not_contains "Insights" "$INSIGHTS_RESPONSE" '"triggerBreakdown"'

echo "==> Emotion snapshots require authentication"
EMOTION_UNAUTH=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/emotion-snapshots" \
  -H "Content-Type: application/json" \
  -d '{"emotions":{"Joy":0.5}}')
if [ "$EMOTION_UNAUTH" != "401" ] && [ "$EMOTION_UNAUTH" != "307" ] && [ "$EMOTION_UNAUTH" != "302" ]; then
  echo "Expected emotion snapshot endpoint to require auth, got $EMOTION_UNAUTH"
  exit 1
fi

echo "==> Storing private Hume emotion snapshot"
EMOTION_RESPONSE=$(curl -s -b "$COOKIE_JAR" -X POST "$BASE_URL/api/emotion-snapshots" \
  -H "Content-Type: application/json" \
  -d '{"source":"rancho","emotions":{"Joy":0.4,"Anxiety":0.7}}')
require_json_success "Emotion snapshot" "$EMOTION_RESPONSE"

echo "==> Fetching wellness image"
IMAGE_RESPONSE=$(curl -s -b "$COOKIE_JAR" "$BASE_URL/api/media/images?moodScore=7")
require_json_success "Wellness image" "$IMAGE_RESPONSE"

echo "==> Fetching meditation videos"
VIDEO_RESPONSE=$(curl -s -b "$COOKIE_JAR" "$BASE_URL/api/media/videos?category=meditation")
require_json_success "Meditation videos" "$VIDEO_RESPONSE"

echo "==> All smoke tests passed"
