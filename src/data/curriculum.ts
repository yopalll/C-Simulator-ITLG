import { CurriculumTopic } from '../types/curriculum';

/**
 * STRUKTUR KURIKULUM DATA-DRIVEN — LABORATORIUM DASAR PEMROGRAMAN (ITLG)
 *
 * Arsitektur ini dirancang secara modular. Untuk menambahkan topik praktikum baru
 * (misalnya: Pointers, Structs, Strings, Functions), cukup tambahkan objek baru
 * atau ubah properti `locked: false` pada array `CURRICULUM_DATA` di bawah ini
 * tanpa perlu mengubah komponen layout utama, Sidebar, <UniversalCodeEditor />,
 * maupun <UniversalRAMVisualizer />.
 */
export const CURRICULUM_DATA: CurriculumTopic[] = [
  {
    id: 'topic-1-array',
    topicNumber: 'TOPIK 01',
    title: 'Array Dasar',
    subtitle: 'Struktur Data Linear & Alokasi Memori Kontigu',
    locked: false,
    estimatedDuration: '120 Menit (Praktikum)',
    modules: [
      {
        id: 'array-welcome',
        code: 'PENGANTAR',
        title: 'Pengantar & Anatomi Array',
        subtitle: 'Tiga Pilar Utama: Nama, Nilai, dan Indeks',
        type: 'welcome',
        interactiveMode: 'welcome',
        conceptSummary:
          'Kalau kamu punya banyak data tapi cuma mau satu nama variabel — itulah fungsi Array. Array menyimpan sekumpulan data bertipe sama dalam blok memori yang bersebelahan (kontigu) dan diakses menggunakan nomor indeks mulai dari 0.',
        keyPoints: [
          {
            title: '01. NAMA (Identifier)',
            description:
              'Satu nama variabel tunggal yang mewakili keseluruhan kumpulan data di memori, bukan puluhan nama variabel terpisah.',
            codeSnippet: 'int nilai[5]; // "nilai" adalah NAMA array',
          },
          {
            title: '02. NILAI (Element Value)',
            description:
              'Isi data aktual yang tersimpan di dalam setiap ruang/kotak array. Seluruh nilai wajib memiliki tipe data yang seragam (homogen).',
            codeSnippet: 'int nilai[5] = {85, 90, 78, 92, 88};',
          },
          {
            title: '03. INDEKS (Zero-Based Offset)',
            description:
              'Nomor urut posisi elemen di dalam array. Dalam bahasa C/C++, indeks SELALU dimulai dari 0 hingga (N - 1).',
            codeSnippet: 'nilai[0] -> 85  |  nilai[4] -> 88',
          },
        ],
        initialCode: `#include <stdio.h>

int main() {
    // Satu NAMA variabel ("nilai") menampung 5 NILAI sekaligus
    int nilai[5] = {85, 90, 78, 92, 88};

    // Mengakses elemen menggunakan INDEKS (dimulai dari 0)
    printf("Elemen pertama (nilai[0]): %d\\n", nilai[0]);
    printf("Elemen ketiga  (nilai[2]): %d\\n", nilai[2]);
    printf("Elemen terakhir(nilai[4]): %d\\n", nilai[4]);

    return 0;
}`,
        defaultMemoryBlocks: [
          { address: '0x7ffe00', value: 85, label: 'nilai[0]', highlight: true, dataType: 'int', byteSize: 4, subLabel: 'Indeks 0 (Awal)' },
          { address: '0x7ffe04', value: 90, label: 'nilai[1]', highlight: false, dataType: 'int', byteSize: 4, subLabel: 'Indeks 1 (+4B)' },
          { address: '0x7ffe08', value: 78, label: 'nilai[2]', highlight: true, dataType: 'int', byteSize: 4, subLabel: 'Indeks 2 (+8B)' },
          { address: '0x7ffe0c', value: 92, label: 'nilai[3]', highlight: false, dataType: 'int', byteSize: 4, subLabel: 'Indeks 3 (+12B)' },
          { address: '0x7ffe10', value: 88, label: 'nilai[4]', highlight: true, dataType: 'int', byteSize: 4, subLabel: 'Indeks 4 (Akhir)' },
        ],
      },
      {
        id: 'modul-1-konsep-dasar',
        code: 'MODUL 01',
        title: 'Konsep Dasar',
        subtitle: 'Variabel Tunggal (int angka1...) vs Array (int angka[6])',
        type: 'module',
        interactiveMode: 'konsep-dasar',
        conceptSummary:
          'Tanpa Array, menyimpan 6 nilai membutuhkan 6 deklarasi variabel berbeda (angka1 s/d angka6) yang tidak bisa diiterasi dengan perulangan. Dengan Array (int angka[6]), keenam nilai dikelompokkan dalam satu blok memori berurutan di bawah satu nama.',
        keyPoints: [
          {
            title: 'Masalah Variabel Konvensional',
            description:
              'Mendeklarasikan int angka1, angka2, angka3, angka4, angka5, angka6; membuat kode tidak efisien dan mustahil diproses menggunakan for-loop.',
            codeSnippet: 'int angka1 = 10, angka2 = 20, angka3 = 30;',
          },
          {
            title: 'Solusi Deklarasi Array',
            description:
              'Sintaks tipe_data nama_array[ukuran]; mengalokasikan ruang memori bersebelahan sebanyak ukuran elemen.',
            codeSnippet: 'int angka[6] = {10, 20, 30, 40, 50, 60};',
          },
          {
            title: 'Sifat Homogen & Kontigu',
            description:
              'Semua elemen bertipe sama (int = 4 byte) dan beralamat RAM berurutan (selisih tepat 4 byte antar elemen).',
            codeSnippet: '0x7ffe00 -> 0x7ffe04 -> 0x7ffe08',
          },
        ],
        initialCode: `#include <stdio.h>

int main() {
    // Bandingkan 6 variabel terpisah vs 1 Array berukuran 6:
    int angka[6] = {10, 20, 30, 40, 50, 60};

    printf("Data ke-1 (angka[0]): %d\\n", angka[0]);
    printf("Data ke-2 (angka[1]): %d\\n", angka[1]);
    printf("Data ke-6 (angka[5]): %d\\n", angka[5]);

    return 0;
}`,
        defaultMemoryBlocks: [
          { address: '0x7ffe00', value: 10, label: 'angka[0]', highlight: true, dataType: 'int', byteSize: 4 },
          { address: '0x7ffe04', value: 20, label: 'angka[1]', highlight: true, dataType: 'int', byteSize: 4 },
          { address: '0x7ffe08', value: 30, label: 'angka[2]', highlight: false, dataType: 'int', byteSize: 4 },
          { address: '0x7ffe0c', value: 40, label: 'angka[3]', highlight: false, dataType: 'int', byteSize: 4 },
          { address: '0x7ffe10', value: 50, label: 'angka[4]', highlight: false, dataType: 'int', byteSize: 4 },
          { address: '0x7ffe14', value: 60, label: 'angka[5]', highlight: true, dataType: 'int', byteSize: 4 },
        ],
        challenge: {
          title: 'Tantangan Lab 01: Mengubah Elemen Terakhir',
          instruction:
            'Ubah nilai elemen terakhir pada array angka[6] menjadi 99 di dalam editor kode (baik melalui inisialisasi maupun assignment angka[5] = 99;), lalu klik Jalankan Kode.',
          hint: 'Ingat bahwa untuk array berukuran 6, elemen terakhir berada pada indeks ke-5 (angka[5]).',
          expectedCheckDescription: 'Elemen angka[5] bernilai 99 di memori RAM',
          quiz: {
            question: 'Jika kita mendeklarasikan int data[8]; berapakah indeks dari elemen paling akhir?',
            options: ['data[8]', 'data[7]', 'data[1]', 'data[0]'],
            correctIndex: 1,
            explanation:
              'Karena indeks dimulai dari 0 (Zero-Based Indexing), array berukuran N memiliki indeks valid dari 0 hingga N-1. Untuk N=8, indeks terakhir adalah 7.',
          },
        },
      },
      {
        id: 'modul-2-inisialisasi',
        code: 'MODUL 02',
        title: 'Inisialisasi Array',
        subtitle: 'Kosong (Garbage Value), Otomatis / Sebagian, dan Lengkap',
        type: 'module',
        interactiveMode: 'inisialisasi',
        conceptSummary:
          'Cara kita mendeklarasikan array menentukan isi awal memorinya di RAM. Array lokal tanpa inisialisasi menyimpan nilai sampah (garbage value), inisialisasi sebagian otomatis mengisi sisa elemen dengan 0, dan inisialisasi tanpa angka ukuran otomatis menghitung panjang dari jumlah elemen.',
        keyPoints: [
          {
            title: '1. Deklarasi Kosong (Tanpa Inisialisasi)',
            description:
              'int arr[5]; hanya memesan 5 kotak di RAM tanpa membersihkan isinya. Nilai di dalamnya adalah residu memori (Garbage Value).',
            codeSnippet: 'int kosong[5]; // Berisi Garbage Value!',
          },
          {
            title: '2. Inisialisasi Sebagian & Otomatis',
            description:
              'int parsial[5] = {10, 20}; mengisi indeks 0 dan 1, sedangkan sisanya (indeks 2, 3, 4) otomatis diisi 0 oleh compiler C. Ukuran juga bisa otomatis: int autoArr[] = {10, 20, 30};',
            codeSnippet: 'int parsial[5] = {10, 20}; // Sisa elemen = 0',
          },
          {
            title: '3. Inisialisasi Lengkap',
            description:
              'Menentukan ukuran eksplisit sekaligus mengisi seluruh nilai elemen secara lengkap.',
            codeSnippet: 'int lengkap[5] = {10, 20, 30, 40, 50};',
          },
        ],
        initialCode: `#include <stdio.h>

int main() {
    // Coba ubah antara Kosong, Sebagian, atau Lengkap:
    int angka[5] = {15, 30, 45, 60, 75};

    printf("angka[0] = %d\\n", angka[0]);
    printf("angka[2] = %d\\n", angka[2]);
    printf("angka[4] = %d\\n", angka[4]);

    return 0;
}`,
        defaultMemoryBlocks: [
          { address: '0x7ffe00', value: 15, label: 'angka[0]', highlight: true, dataType: 'int', byteSize: 4 },
          { address: '0x7ffe04', value: 30, label: 'angka[1]', highlight: false, dataType: 'int', byteSize: 4 },
          { address: '0x7ffe08', value: 45, label: 'angka[2]', highlight: true, dataType: 'int', byteSize: 4 },
          { address: '0x7ffe0c', value: 60, label: 'angka[3]', highlight: false, dataType: 'int', byteSize: 4 },
          { address: '0x7ffe10', value: 75, label: 'angka[4]', highlight: true, dataType: 'int', byteSize: 4 },
        ],
        challenge: {
          title: 'Tantangan Lab 02: Inisialisasi Nol Otomatis',
          instruction:
            'Deklarasikan array bernama angka berukuran 5 yang hanya diinisialisasi 2 nilai pertama: int angka[5] = {100, 200}; lalu jalankan kode untuk melihat bagaimana compiler mengisi indeks 2, 3, dan 4 dengan 0.',
          hint: 'Gunakan sintaks: int angka[5] = {100, 200};',
          expectedCheckDescription: 'angka[0]=100, angka[1]=200, dan angka[4]=0',
          quiz: {
            question: 'Apa isi dari elemen arr[3] jika kita menulis deklarasi lokal: int arr[5] = {7, 14}; di dalam fungsi main()?',
            options: ['Nilai sampah (Garbage Value)', '0 (Nol)', '14', 'Error saat kompilasi'],
            correctIndex: 1,
            explanation:
              'Dalam standar bahasa C/C++, jika sebuah array diinisialisasi sebagian (minimal satu nilai ditentukan di dalam kurung kurawal), seluruh sisa elemen yang tidak disebutkan akan diinisialisasi secara otomatis menjadi 0.',
          },
        },
      },
      {
        id: 'modul-3-akses-modifikasi',
        code: 'MODUL 03',
        title: 'Akses & Modifikasi',
        subtitle: 'Operasi Baca/Tulis Valid vs Error Out-of-Bounds (nilai[3])',
        type: 'module',
        interactiveMode: 'akses-modifikasi',
        conceptSummary:
          'Elemen array dapat dibaca dan dimodifikasi kapan saja menggunakan operator subscript [indeks]. Namun bahasa C tidak melakukan pengecekan batas otomatis saat kompilasi: mengakses nilai[3] pada array berukuran 3 (int nilai[3]) akan mengakses memori ilegal di luar batas (Index Out of Bounds)!',
        keyPoints: [
          {
            title: 'Akses & Modifikasi Valid',
            description:
              'Pada int nilai[3] = {70, 80, 90}; indeks yang sah hanyalah nilai[0], nilai[1], dan nilai[2]. Kita dapat mengubah isinya misal nilai[1] = 85;',
            codeSnippet: 'nilai[1] = 85; // Valid (Indeks 1 ada di dalam batas)',
          },
          {
            title: 'Bahaya Index Out of Bounds (nilai[3])',
            description:
              'Mengakses atau menulis ke nilai[3] berarti menyentuh alamat 0x7ffe0c yang bukan milik array nilai[3]. Ini memicu pembacaan Garbage Value atau merusak memori variabel lain (Undefined Behavior / Segmentation Fault).',
            codeSnippet: 'nilai[3] = 100; // FATAL: Indeks 3 di luar batas!',
          },
        ],
        initialCode: `#include <stdio.h>

int main() {
    int nilai[3] = {70, 80, 90};

    // Modifikasi elemen yang valid (indeks 0, 1, atau 2)
    nilai[1] = 95;

    printf("nilai[0] = %d\\n", nilai[0]);
    printf("nilai[1] = %d (Telah dimodifikasi)\\n", nilai[1]);
    printf("nilai[2] = %d\\n", nilai[2]);

    // Coba hapus komentar di bawah untuk menguji Error nilai[3]:
    // nilai[3] = 100;

    return 0;
}`,
        defaultMemoryBlocks: [
          { address: '0x7ffe00', value: 70, label: 'nilai[0]', highlight: false, dataType: 'int', byteSize: 4 },
          { address: '0x7ffe04', value: 95, label: 'nilai[1]', highlight: true, dataType: 'int', byteSize: 4 },
          { address: '0x7ffe08', value: 90, label: 'nilai[2]', highlight: false, dataType: 'int', byteSize: 4 },
        ],
        challenge: {
          title: 'Tantangan Lab 03: Simulasi & Perbaikan Out-of-Bounds',
          instruction:
            'Uji peringatan memori dengan mengaktifkan baris nilai[3] = 100; lalu amati blok merah Out-of-Bounds. Setelah itu, perbaiki kode agar memodifikasi elemen terakhir yang sah (nilai[2] = 100;) tanpa error.',
          hint: 'Ganti nilai[3] = 100; menjadi nilai[2] = 100; lalu klik Jalankan Kode.',
          expectedCheckDescription: 'Tidak ada error Out-of-Bounds dan nilai[2] bernilai 100',
          quiz: {
            question: 'Mengapa pengaksesan nilai[3] pada deklarasi int nilai[3] = {70, 80, 90}; berbahaya dalam bahasa C?',
            options: [
              'Karena nilai[3] otomatis menghapus seluruh isi array',
              'Karena indeks valid hanya 0, 1, dan 2; indeks 3 mengakses alamat RAM di luar alokasi array',
              'Karena bahasa C memulai indeks dari 1 sehingga nilai[0] yang salah',
              'Karena array bertipe int hanya bisa menampung maksimal 2 elemen',
            ],
            correctIndex: 1,
            explanation:
              'Array berukuran 3 hanya mengalokasikan 3 slot memori untuk indeks 0, 1, dan 2. Mengakses indeks 3 berarti melompat 12 byte dari alamat awal ke area memori milik variabel lain atau sistem.',
          },
        },
      },
      {
        id: 'modul-4-iterasi-loop',
        code: 'MODUL 04',
        title: 'Iterasi Loop pada Array',
        subtitle: 'Traversal Otomatis dengan for(int i = 0; i < n; i++)',
        type: 'module',
        interactiveMode: 'iterasi-loop',
        conceptSummary:
          'Kekuatan sejati Array muncul saat dipadukan dengan perulangan (Loop). Variabel counter i pada for(int i = 0; i < n; i++) bergerak secara sekuensial dari indeks 0 hingga n-1, memungkinkan kita mencetak, menjumlahkan, atau memodifikasi ribuan elemen hanya dengan beberapa baris kode.',
        keyPoints: [
          {
            title: 'Pola Standar Traversal Array',
            description:
              'Mulai dari i = 0 (indeks pertama), gunakan kondisi i < n (berhenti tepat di n-1), dan lakukan increment i++ pada setiap siklus.',
            codeSnippet: 'for (int i = 0; i < 5; i++) { printf("%d ", skor[i]); }',
          },
          {
            title: 'Akumulasi & Transformasi Data',
            description:
              'Di dalam body loop, kita dapat menjumlahkan seluruh elemen ke dalam variabel akumulator atau mengalikan setiap elemen.',
            codeSnippet: 'total += skor[i];',
          },
        ],
        initialCode: `#include <stdio.h>

int main() {
    int skor[5] = {12, 24, 36, 48, 60};
    int total = 0;

    for (int i = 0; i < 5; i++) {
        printf("Iterasi i=%d -> skor[%d] = %d\\n", i, i, skor[i]);
        total += skor[i];
    }

    printf("Total seluruh elemen = %d\\n", total);
    return 0;
}`,
        defaultMemoryBlocks: [
          { address: '0x7ffe00', value: 12, label: 'skor[0]', highlight: true, dataType: 'int', byteSize: 4 },
          { address: '0x7ffe04', value: 24, label: 'skor[1]', highlight: true, dataType: 'int', byteSize: 4 },
          { address: '0x7ffe08', value: 36, label: 'skor[2]', highlight: true, dataType: 'int', byteSize: 4 },
          { address: '0x7ffe0c', value: 48, label: 'skor[3]', highlight: true, dataType: 'int', byteSize: 4 },
          { address: '0x7ffe10', value: 60, label: 'skor[4]', highlight: true, dataType: 'int', byteSize: 4 },
        ],
        challenge: {
          title: 'Tantangan Lab 04: Traversal & Akumulasi Loop',
          instruction:
            'Ubah nilai awal array skor[5] menjadi {10, 20, 30, 40, 50} dan jalankan perulangan for sehingga konsol menampilkan hasil total akumulasi sebesar 150.',
          hint: 'Pastikan deklarasi tertulis: int skor[5] = {10, 20, 30, 40, 50}; dan loop berjalan dari i = 0 hingga i < 5.',
          expectedCheckDescription: 'Output konsol mencetak total = 150 dan 5 elemen terinisialisasi',
          quiz: {
            question: 'Mengapa kondisi perulangan untuk array berukuran N umumnya ditulis i < N dan BUKAN i <= N?',
            options: [
              'Agar perulangan berjalan lebih cepat di CPU',
              'Karena jika menggunakan i <= N, iterasi terakhir akan mengakses indeks ke-N yang berada di luar batas (Out of Bounds)',
              'Karena operator <= tidak didukung di dalam for-loop bahasa C',
              'Karena indeks pertama array dimulai dari 1',
            ],
            correctIndex: 1,
            explanation:
              'Jika i <= N digunakan pada array berukuran N, maka saat i mencapai nilai N, program akan mencoba mengakses arr[N] yang merupakan elemen ke-(N+1) dan memicu bug Out-of-Bounds.',
          },
        },
      },
      {
        id: 'modul-5-sizeof',
        code: 'MODUL 05',
        title: 'Operator sizeof pada Array',
        subtitle: 'Menghitung Kapasitas Byte & Panjang Dinamis sizeof(arr) / sizeof(arr[0])',
        type: 'module',
        interactiveMode: 'sizeof-operator',
        conceptSummary:
          'Operator sizeof() mengembalikan ukuran memori dalam satuan Byte (bukan jumlah elemen!). Karena 1 elemen int berukuran 4 byte, maka array int dengan 6 elemen memiliki sizeof(arr) = 24 byte. Untuk mendapatkan jumlah elemen secara dinamis, bagi ukuran total array dengan ukuran satu elemennya: sizeof(arr) / sizeof(arr[0]).',
        keyPoints: [
          {
            title: 'sizeof(arr) — Total Byte di RAM',
            description:
              'Menghitung total kapasitas memori yang ditempati seluruh array: Jumlah_Elemen × Ukuran_Tipe_Data.',
            codeSnippet: 'int data[6]; // sizeof(data) = 6 * 4 byte = 24 byte',
          },
          {
            title: 'sizeof(arr[0]) — Ukuran 1 Elemen',
            description:
              'Mengambil ukuran byte dari elemen pertama (misal int = 4 byte, double = 8 byte, char = 1 byte).',
            codeSnippet: 'sizeof(data[0]) // Hasil = 4 byte',
          },
          {
            title: 'Rumus Panjang Array Dinamis',
            description:
              'Dengan membagi total byte terhadap byte per elemen, loop kita tetap aman meskipun ukuran array diubah di kemudian hari.',
            codeSnippet: 'int n = sizeof(data) / sizeof(data[0]); // 24 / 4 = 6 elemen',
          },
        ],
        initialCode: `#include <stdio.h>

int main() {
    int data[6] = {5, 10, 15, 20, 25, 30};

    int totalByte = sizeof(data);
    int byteElemen = sizeof(data[0]);
    int panjang = sizeof(data) / sizeof(data[0]);

    printf("Ukuran total array (sizeof(data))   : %d byte\\n", totalByte);
    printf("Ukuran 1 elemen    (sizeof(data[0])): %d byte\\n", byteElemen);
    printf("Jumlah elemen      (panjang array)  : %d elemen\\n", panjang);

    return 0;
}`,
        defaultMemoryBlocks: [
          { address: '0x7ffe00', value: 5, label: 'data[0]', highlight: true, dataType: 'int', byteSize: 4, subLabel: '4 Byte' },
          { address: '0x7ffe04', value: 10, label: 'data[1]', highlight: false, dataType: 'int', byteSize: 4, subLabel: '4 Byte' },
          { address: '0x7ffe08', value: 15, label: 'data[2]', highlight: false, dataType: 'int', byteSize: 4, subLabel: '4 Byte' },
          { address: '0x7ffe0c', value: 20, label: 'data[3]', highlight: false, dataType: 'int', byteSize: 4, subLabel: '4 Byte' },
          { address: '0x7ffe10', value: 25, label: 'data[4]', highlight: false, dataType: 'int', byteSize: 4, subLabel: '4 Byte' },
          { address: '0x7ffe14', value: 30, label: 'data[5]', highlight: false, dataType: 'int', byteSize: 4, subLabel: '4 Byte' },
        ],
        challenge: {
          title: 'Tantangan Lab 05: Eksperimen Kapasitas Byte Array',
          instruction:
            'Ubah ukuran deklarasi array di editor menjadi 8 elemen (int data[8] = {5, 10, 15, 20, 25, 30, 35, 40};) lalu jalankan kode untuk membuktikan bahwa rumus sizeof(data) / sizeof(data[0]) otomatis menghasilkan 8 elemen (32 byte).',
          hint: 'Ubah int data[6] menjadi int data[8] beserta 8 nilai di dalamnya, kemudian klik Jalankan Kode.',
          expectedCheckDescription: 'Total memori 32 byte dan jumlah elemen terhitung 8 secara otomatis',
          quiz: {
            question: 'Jika dideklarasikan double suhu[10]; (di mana tipe double berukuran 8 byte), berapakah nilai dari sizeof(suhu) dan sizeof(suhu) / sizeof(suhu[0])?',
            options: [
              'sizeof(suhu) = 10 byte, panjang = 10',
              'sizeof(suhu) = 80 byte, panjang = 10',
              'sizeof(suhu) = 40 byte, panjang = 5',
              'sizeof(suhu) = 80 byte, panjang = 80',
            ],
            correctIndex: 1,
            explanation:
              'Karena setiap elemen double menempati 8 byte dan terdapat 10 elemen, maka sizeof(suhu) = 10 × 8 = 80 byte. Ketika dibagi dengan sizeof(suhu[0]) yang bernilai 8 byte, kita memperoleh panjang = 80 / 8 = 10 elemen.',
          },
        },
      },
      {
        id: 'modul-6-array-2d',
        code: 'MODUL 06',
        title: 'Array 2 Dimensi (Matriks)',
        subtitle: 'Representasi Grid Logis [Baris][Kolom] vs Strip 1D Fisik di RAM',
        type: 'module',
        interactiveMode: 'array-2d',
        conceptSummary:
          'Secara logis, Array 2D (int matriks[2][3]) kita bayangkan sebagai tabel berbentuk baris dan kolom. Namun secara fisik, keping RAM komputer adalah ruang 1 dimensi yang lurus! Bahasa C menyimpan matriks menggunakan urutan Row-Major Order (baris demi baris disusun berurutan di memori).',
        keyPoints: [
          {
            title: 'Deklarasi [Baris][Kolom]',
            description:
              'Indeks pertama selalu menyatakan jumlah BARIS (horisontal), dan indeks kedua menyatakan jumlah KOLOM (vertikal).',
            codeSnippet: 'int matriks[2][3] = { {11, 12, 13}, {21, 22, 23} };',
          },
          {
            title: 'Pemetaan Fisik Row-Major Order di RAM',
            description:
              'Seluruh elemen Baris 0 ([0][0], [0][1], [0][2]) disimpan terlebih dahulu di RAM, diikuti langsung oleh Baris 1 ([1][0], [1][1], [1][2]) tanpa jeda.',
            codeSnippet: 'Offset_1D = (indeks_baris * jumlah_kolom) + indeks_kolom',
          },
        ],
        initialCode: `#include <stdio.h>

int main() {
    // Matriks 2 Baris x 3 Kolom (Total 6 elemen di RAM)
    int matriks[2][3] = {
        {11, 12, 13},
        {21, 22, 23}
    };

    printf("Elemen Baris 0, Kolom 2 (matriks[0][2]): %d\\n", matriks[0][2]);
    printf("Elemen Baris 1, Kolom 0 (matriks[1][0]): %d\\n", matriks[1][0]);
    printf("Elemen Baris 1, Kolom 2 (matriks[1][2]): %d\\n", matriks[1][2]);

    return 0;
}`,
        defaultMemoryBlocks: [
          { address: '0x7ffe00', value: 11, label: 'matriks[0][0]', highlight: false, dataType: 'int', byteSize: 4, row: 0, col: 0, subLabel: 'Baris 0, Kolom 0' },
          { address: '0x7ffe04', value: 12, label: 'matriks[0][1]', highlight: false, dataType: 'int', byteSize: 4, row: 0, col: 1, subLabel: 'Baris 0, Kolom 1' },
          { address: '0x7ffe08', value: 13, label: 'matriks[0][2]', highlight: true, dataType: 'int', byteSize: 4, row: 0, col: 2, subLabel: 'Baris 0, Kolom 2' },
          { address: '0x7ffe0c', value: 21, label: 'matriks[1][0]', highlight: true, dataType: 'int', byteSize: 4, row: 1, col: 0, subLabel: 'Baris 1, Kolom 0' },
          { address: '0x7ffe10', value: 22, label: 'matriks[1][1]', highlight: false, dataType: 'int', byteSize: 4, row: 1, col: 1, subLabel: 'Baris 1, Kolom 1' },
          { address: '0x7ffe14', value: 23, label: 'matriks[1][2]', highlight: true, dataType: 'int', byteSize: 4, row: 1, col: 2, subLabel: 'Baris 1, Kolom 2' },
        ],
        challenge: {
          title: 'Tantangan Lab 06: Modifikasi Sel Matriks 2D',
          instruction:
            'Tambahkan perintah matriks[1][1] = 99; di dalam kode program untuk mengubah nilai elemen tengah pada baris kedua, kemudian klik Jalankan Kode dan aktifkan Visualisasi RAM untuk melihat posisinya di alamat 0x7ffe10.',
          hint: 'Tambahkan baris matriks[1][1] = 99; sebelum perintah return 0;.',
          expectedCheckDescription: 'Sel matriks[1][1] pada alamat 0x7ffe10 bernilai 99',
          quiz: {
            question: 'Dalam skema Row-Major Order untuk int matriks[2][3], elemen manakah yang disimpan tepat setelah matriks[0][2] di dalam keping RAM fisik?',
            options: ['matriks[0][3]', 'matriks[1][0]', 'matriks[2][0]', 'matriks[1][1]'],
            correctIndex: 1,
            explanation:
              'Karena jumlah kolom adalah 3 (indeks kolom 0, 1, 2), maka matriks[0][2] adalah elemen terakhir di Baris 0. Tepat di sebelahnya pada keping RAM fisik adalah elemen pertama dari Baris 1, yaitu matriks[1][0].',
          },
        },
      },
    ],
  },

  // ============================================================================
  // FUTURE-PROOFING: TOPIK BERIKUTNYA (DAPAT DIAKTIFKAN KAPAN SAJA)
  // Cukup ubah `locked: false` dan tambahkan daftar `modules` untuk memperluas simulator.
  // ============================================================================
  {
    id: 'topic-2-pointers',
    topicNumber: 'TOPIK 02',
    title: 'Pointer & Referensi Memori',
    subtitle: 'Operator Address-of (&), Dereference (*), dan Pointer Arithmetic',
    locked: true,
    estimatedDuration: 'Segera Hadir',
    modules: [
      {
        id: 'pointer-intro',
        code: 'MODUL 01',
        title: 'Konsep Alamat & Variabel Pointer',
        subtitle: 'Menyimpan Alamat Hex di dalam Variabel int *ptr',
        type: 'module',
        interactiveMode: 'generic',
        conceptSummary: 'Modul ini disiapkan untuk materi praktikum Pointer & Referensi.',
        keyPoints: [],
        initialCode: '// Modul Pointer akan segera dibuka oleh Asisten Laboratorium.',
        defaultMemoryBlocks: [],
      },
    ],
  },
  {
    id: 'topic-3-structs',
    topicNumber: 'TOPIK 03',
    title: 'Struct & Tipe Data Bentukan',
    subtitle: 'Pengelompokan Data Heterogen & Memory Alignment',
    locked: true,
    estimatedDuration: 'Segera Hadir',
    modules: [
      {
        id: 'struct-intro',
        code: 'MODUL 01',
        title: 'Deklarasi Struct Mahasiswa',
        subtitle: 'Menggabungkan NIM, Nama, dan IPK dalam Satu Entitas',
        type: 'module',
        interactiveMode: 'generic',
        conceptSummary: 'Modul ini disiapkan untuk materi praktikum Struct.',
        keyPoints: [],
        initialCode: '// Modul Struct akan segera dibuka oleh Asisten Laboratorium.',
        defaultMemoryBlocks: [],
      },
    ],
  },
  {
    id: 'topic-4-strings',
    topicNumber: 'TOPIK 04',
    title: 'Manipulasi String (Char Array)',
    subtitle: 'Null Terminator (\\0) & Pustaka <string.h>',
    locked: true,
    estimatedDuration: 'Segera Hadir',
    modules: [
      {
        id: 'string-intro',
        code: 'MODUL 01',
        title: 'String sebagai Array of Characters',
        subtitle: 'Peran Karakter Null (\\0) di Akhir Array Karakter',
        type: 'module',
        interactiveMode: 'generic',
        conceptSummary: 'Modul ini disiapkan untuk materi praktikum String.',
        keyPoints: [],
        initialCode: '// Modul String akan segera dibuka oleh Asisten Laboratorium.',
        defaultMemoryBlocks: [],
      },
    ],
  },
];
