#!/bin/bash

# Script to set up the volks-typo-marketing repository

echo "Setting up volks-typo-marketing repository..."

# Create the marketing repo directory
cd ..
mkdir -p volks-typo-marketing
cd volks-typo-marketing

# Initialize git
git init

# Copy files from temporary location
cp -r /tmp/volks-typo-marketing/* .
cp /tmp/volks-typo-marketing/.gitignore .

# Create initial commit
git add .
git commit -m "Initial commit: Marketing strategy and good first issue templates"

echo "Marketing repository created successfully!"
echo ""
echo "Next steps:"
echo "1. Create a private GitHub repository named 'volks-typo-marketing'"
echo "2. Add the remote: git remote add origin https://github.com/yourusername/volks-typo-marketing.git"
echo "3. Push the initial commit: git push -u origin main"
echo ""
echo "Don't forget to return to the volks-typo directory and remove the marketing files!"