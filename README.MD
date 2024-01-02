# Installasi backend

npm init -y
npm i express dotenv joi bcrypt jsonwebtoken cookie-parser mongoose

# Install Express

- Install npm, node, dan express

# Install MongoDB

- Install mongodb windows community edition dari https://www.mongodb.com/try/download/community
  - Untuk cara gampang, install complete saja, lalu tinggal next-next sampai selesai (seharusnya dengan ini sekalian meng-install compass)
  - Peringatan, jangan install mongo compass pada step ini, karena super lama (kemungkinan karena mereka download compass di background)

# Install MongoSH

- Bila ingin menggunakan terminal untuk menggunakan MongoDB, bisa menggunakan mongosh
- Install di https://www.mongodb.com/try/download/shell
- Setelah install extract ke sebuah folder/lokasi yang kalian mau, lalu daftarkan ke environment variable laptop/komputer kalian
- Tutor mencatat env
  - buka windows lalu search "env"
  - pilih "edit environment variables"
  - pilih "environment variables"
  - pilih Path LALU TEKAN EDIT, !!! HATI-HATI JANGAN TEKAN DELETE !!!
  - Temukan lokasi mongosh.exe, lalu ambil lokasiinya
  - lalu new copas ke sana
  - ok sampe tuntas

# MongoDB GUI

- Ada banyak pilihan
  - MongoDB Compass gratis, langsung dari developer, katanya tidak terlalu jago
  - Robo3T / Studio 3T, katanya sih bagus, ada versi free dan berbayar
  - NoSqlBooster support javascript, lebih jago, tapi bayar
- Untuk kuliah ini kita akan pakai mongosh dan compass

# Cheat Sheet

- https://www.mongodb.com/developer/products/mongodb/cheat-sheet/

# Bila terjadi error

- MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017
  - Kemungkinan besar karena servicenya belum nyala
  - klik windows, search services
  - cari mongodb service, lalu nyalakan

# Konsep Basic

- Dalam mongodb beberapa istilah rdbms berubah
  - Database -> database
  - Tabel -> collection
  - Row / Data -> document

# HATI-HATI KARENA SANGAT FLEXIBLE

- Tipe data pastikan konsisten, kalau string ya string kalau int ya int

# Catatan Basic Koding

- show dbs
- use kuliah_iso_movie
- show collections
- db.dropDatabase("kuliah_iso_movie")
- Insert
  - db.kategori_movie.insertOne({\_id:"1",nama:"Action"})
  - db.kategori_movie.insertOne({nama:"Horror",deskripsi:"ini kategori horror"})
  - db.kategori_movie.insert([{_id:"2",nama:"Romance"},{_id:"3",nama:"Comedy"}])
  - db.movie.insert([
    {_id:1,nama:"Harry Potter", tahun_terbit: "1991"}
    ])
  - kategori_id = db.kategori_movie.findOne({nama:"Romance"}).\_id
  - db.movie.insert([
    {_id:2,nama:"Percy Jackson", tahun_terbit:"1992", kategori:kategori_id}
    ])
- Read
  - Projection itu seperti select kolom mana yang mau muncul
    - db.movie.findOne({\_id:2},{nama:1, tahun_terbit:1, \_id:0})
    - db.movie.findOne({\_id:2},{nama:0})
  - Sort, skip, limit
    - db.movie.find().sort({tahun_terbit:-1, nama:1}).skip(1).limit(3)
  - db.movie.find({tahun_terbit: {$ne:1991}}).sort({tahun_terbit:1})
    - Bagaimana kalau lebih dari satu misalnya not equal 1991 dan 1990?, maka ditulis db.movie.find({tahun_terbit: {$nin:[1990,1991]}}).sort({tahun_terbit:1})
  - db.movie.find({nama:{$eq:"Pyaar Impossible"}, tahun_terbit: 1985})
    - kalau butuh like bisa pakai /tulisan/ misalnya db.movie.find({nama:/Pyaar/, tahun_terbit: 1985})
  - Contoh untuk operasi AND
    - db.movie.find({nama:/of/, tahun_terbit: {$gt:2000,$lte:2002}})
  - Contoh untuk operasi OR
    - db.movie.find({$or:[{nama:/Year/},{tahun_terbit:{$gt:1990,$lte:1991}}]}).sort({tahun_terbit:1})
  - Contoh operasi count
    - db.movie.countDocuments({$or:[{nama:/Year/},{tahun_terbit:{$gt:1990,$lte:1991}}]})
- exit

# Catatan skips dan limit

- db.movie.find().skip(1).limit(3);

# Catatan Aggregation (menggabunggkan beberapa perintah) dan catatan untuk grouping (group by)

- Contoh kalau mau grouping dan mendapatkan max_id
  - db.movie.aggregate([{$group:{_id:"", "maxId":{$max:"$_id"}}}])
- db.movie.aggregate([
  {$match: {nama:/of/}},
  {$project:{nama:1,tahun_terbit:1,publisher:1,maxAiring:{$max:"$release.airing"}}},
  {$limit:3},
  {$skip:1}
  ])
- db.movie.aggregate([
  {$match: {nama:/of/}},
  {$project:{nama:1,tahun_terbit:1,publisher:1,maxAiring:{$max:"$release.airing"}}},
  {$skip:1},
  {$limit:3}
  ])

# Untuk Update dan Delete gimana?

- Set untuk mengganti sebuah value
  - db.kategori_movie.updateOne({id:4}, {$set:{nama:"Anime Jepang", deskripsi:"Ini anime jejepangan"}})
- Bahkan set untuk menambah property baru
  - db.kategori_movie.updateOne({id:4}, {$set:{genre:["ga","gb","gc"]}})
- Rename Property
  - db.kategori_movie.updateOne({"\_id": "1"}, {$rename: {nama: "namalengkap"}})
- Buang property
  - db.kategori_movie.updateOne({"\_id": "1"}, {$unset: {nama: ""}})

# Install Mongoose

- npm install mongoose --save

# Fakta mengejutkan ttng const

- https://usefulangle.com/post/342/javascript-const-object-change-property

---

# Authentication

npm install bcrypt jsonwebtoken dotenv cookie-parser
