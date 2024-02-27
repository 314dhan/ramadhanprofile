<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Ambil nilai dari formulir
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    // Konfigurasi pengiriman email
    $to = 'ramadhan25321@gmail.com'; // Ganti dengan alamat email Anda
    $subject = 'Pesan dari ' . $name;
    $body = 'Nama: ' . $name . "\n\n" . 'Email: ' . $email . "\n\n" . 'Pesan: ' . $message;

    // Kirim email
    if (mail($to, $subject, $body)) {
        echo 'Pesan berhasil dikirim!';
    } else {
        echo 'Maaf, terjadi kesalahan dalam pengiriman pesan.';
    }
}