# Contributing to C++ Code Mentor

Thanks for considering contributing! Here's how you can help.

## How to Contribute

### Reporting Bugs
1. Check if the bug is already reported in Issues
2. If not, open a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Suggesting Features
1. Open an issue with the "enhancement" label
2. Describe the feature and why it would be useful
3. Include examples if possible

### Code Contributions

1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

### Code Style
- Use meaningful variable names
- Add comments for complex logic
- Follow existing code structure
- Keep functions small and focused

### Testing
Before submitting a PR:
- Test all features manually
- Make sure backend and frontend both work
- Check that no API keys are exposed
- Verify the app runs on a fresh install

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Code_mentor.git
cd Code_mentor

# Install dependencies
npm install
cd server && npm install && cd ..

# Create .env file
cd server
cp .env.example .env
# Add your Groq API key

# Run in development
# Terminal 1
cd server && npm run dev

# Terminal 2
npm run dev
```

## Questions?

Feel free to open an issue or reach out. I'm happy to help!
