# 🚀 Quick Start - Local HTTPS Setup

This guide will get your Gemini clone running on `https://gemini.google.com` in just a few commands!

## Prerequisites

- Windows 10/11
- Docker Desktop installed
- PowerShell (run as Administrator)

## One-Command Setup

Open PowerShell **as Administrator** and run:

```powershell
.\setup.ps1
```

That's it! 🎉

## What the setup script does:

1. ✅ Generates SSL certificate for `gemini.google.com`
2. ✅ Updates Windows hosts file
3. ✅ Installs certificate as trusted
4. ✅ Builds and starts Docker containers
5. ✅ Verifies everything is working

## Access Your App

Open your browser and go to: **https://gemini.google.com**

## Useful Commands

```powershell
# View application logs
docker-compose logs -f

# Restart the application
docker-compose restart

# Stop the application
docker-compose down

# Complete cleanup (removes everything)
.\cleanup.ps1
```

## Troubleshooting

If something doesn't work:

1. Make sure you're running PowerShell as Administrator
2. Check that Docker Desktop is running
3. See the detailed tutorial: `SETUP_TUTORIAL.md`

## Manual Setup

If you prefer to set things up manually, follow the detailed instructions in `SETUP_TUTORIAL.md`.

---

**Need help?** Check the full tutorial in `SETUP_TUTORIAL.md` for detailed explanations and troubleshooting tips.
