Tata cara setup & running (hanya untuk OS Ubuntu):
1. Download NodeJS v 16.x dan npm jika belum ada
2. Pastikan program web laravel (agendakota_v3.0.0-main.zip) sudah di setup
3. Jalankan npm install -g sequelize
4. Jalankan npm install -g sequelize-cli
5. Masuk ke directori repo ini
6. Jalankan sequelize db migrate
7. install pm2 "npm install -g pm2"
8. Jalankan pm2 start ./bin/www
