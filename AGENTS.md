# Project Identity & Facts

## Server Infrastructure
- **Server OS:** Ubuntu 26.04 LTS (installed on an old computer)
- **Local IP:** 192.168.1.245
- **SSH Access:** `ssh aleksandr@192.168.1.245`
- **Primary User/Developer:** aleksandr
- **Windows User:** trush (machine connecting remotely)

## Application Setup
- **Directory:** `~/zmk-app`
- **Process Manager:** PM2 (service name: `zmk-app`)
- **Git Repo:** GitHub (main branch)

## Update Workflow
1. Export changes to GitHub via AI Studio Settings.
2. Connect to server: `ssh aleksandr@192.168.1.245`
3. Pull updates: `cd ~/zmk-app && git pull origin main`
4. Build: `npm run build`
5. Restart: `pm2 restart zmk-app`

## Custom Instructions
- Use Russian for communication with the user.
- Maintain industrial/logistics context for the UI/UX.
- Keep "Tech Support" instructions updated in `AdminPanelHelpTab.tsx`.
