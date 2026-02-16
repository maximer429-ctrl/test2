#!/bin/bash
# Simple test for the Hello World webapp

set -e

echo "🧪 Testing webapp..."

# Check if the webapp is running
if ! curl -s http://localhost:8080 > /dev/null; then
    echo "❌ FAIL: Webapp is not responding at http://localhost:8080"
    exit 1
fi

echo "✓ Webapp is reachable"

# Get the page content
CONTENT=$(curl -s http://localhost:8080)

# Check for "Hello World" text
if echo "$CONTENT" | grep -q "Hello World"; then
    echo "✓ Found 'Hello World' text"
else
    echo "❌ FAIL: 'Hello World' text not found"
    exit 1
fi

# Check for pink color (#ff69b4)
if echo "$CONTENT" | grep -q "#ff69b4"; then
    echo "✓ Found pink color (#ff69b4)"
else
    echo "❌ FAIL: Pink color not found"
    exit 1
fi

# Check for dinosaur SVG
if echo "$CONTENT" | grep -q "dinosaur"; then
    echo "✓ Found dinosaur class/reference"
else
    echo "❌ FAIL: Dinosaur reference not found"
    exit 1
fi

# Check for SVG element (dinosaur pixel art)
if echo "$CONTENT" | grep -q "<svg"; then
    echo "✓ Found SVG element (dinosaur pixel art)"
else
    echo "❌ FAIL: SVG element not found"
    exit 1
fi

echo ""
echo "🎉 All tests passed!"
