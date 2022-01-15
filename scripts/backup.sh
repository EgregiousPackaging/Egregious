# meant to be run locally, not on CI
#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x
day=$(date -I)
echo $day
backupFile="${day}_backup.tar.gz"
ssh debian@51.195.149.81 "docker run --rm -v egregiousdb:/egregiousdb -v /backups:/backups ubuntu tar czf /backups/$backupFile /egregiousdb"
scp debian@51.195.149.81:/backups/$backupFile ./backups/$backupFile
# test it worked
tar -xzf ./backups/$backupFile
if [ ! -f ./backups/$backupFile/backup/sqlite.db ]; then
    echo "Backup failed, sqlite.db not found!"
    exit 1
fi
