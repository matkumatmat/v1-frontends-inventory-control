{# templates/label_template.zpl #}
^XA
~TA000
~JSN
^LT0
^MNW
^MTT
^PON
^PMN
^LH0,0
^JMA
^PR4,4
~SD25
^JUS
^LRN
^CI27
^PA0,1,1,0
^XZ
^XA
^MMT
^PW879
^LL2797
^LS0
^FO40,40^GB799,1319,16,,0^FS
^FO71,265^GB722,707,4^FS
^FO88,287^GB690,78,4^FS
^FT120,342^A0N,42,43^FH\^CI28^FDPRODUCT^FS^CI27
^FT623,342^A0N,42,43^FH\^CI28^FDQTY^FS^CI27
^FO533,296^GB0,669,4^FS

{# ================================================================= #}
{# == BAGIAN MULTI-PRODUK YANG BARU == #}
{# Definisikan posisi Y awal dan tinggi baris untuk daftar produk #}
{% set start_y = 450 %}
{% set line_height = 45 %}

{# Loop untuk setiap item dalam produk_list yang dikirim dari backend #}
{% for item in produk_list %}
  {# Hitung posisi Y untuk baris saat ini. loop.index0 adalah nomor urut loop (mulai dari 0) #}
  {% set current_y = start_y + (loop.index0 * line_height) %}

  {# Cetak Nama Produk di kolom kiri #}
  ^FT120,{{ current_y }}^A0N,38,38^FB380,1,0,L,0^FD{{ item.nama }}^FS

  {# Cetak Qty di kolom kanan #}
  ^FT560,{{ current_y }}^A0N,38,38^FD{{ item.qty }}^FS
{% endfor %}
{# ================================================================= #}


^FO80,985^GB717,77,4^FS
^FT84,1255^A0N,32,33^FH\^CI28^FD!! Sertakan video saat membuka box^FS^CI27
^FT84,1295^A0N,32,33^FH\^CI28^FD!! Pastikan box tidak rusak saat di terima^FS^CI27

^FO80,1079^GB214,130,4^FS
^FT91,1115^A0N,31,30^FH\^CI28^FDBERAT :^FS^CI27
^FT91,1170^A0N,41,40^FH\^CI28^FD{{ berat }}{% if berat %} Kg{% endif %}^FS^CI27

^FO36,1393^GB799,1319,16,,0^FS
^FT581,1434^A0R,78,81^FH\^CI28^FDShipping to :^FS^CI27
^FT691,1437^A0R,78,74^FH\^CI28^FDShipper : PT BIOFARMA (PERSERO)^FS^CI27
^FPH,6^FT77,150^AVN,80,25^FH\^FDDAFTAR^FS
^FPH,6^FT77,230^AVN,80,25^FH\^FDISI^FS

^FO311,1079^GB214,130,4^FS
^FT323,1115^A0N,31,30^FH\^CI28^FDPETUGAS :^FS^CI27
^FT323,1170^A0N,41,40^FH\^CI28^FD{{ petugas }}^FS^CI27


^FO540,1079^GB255,130,4^FS
^FT549,1115^A0N,31,30^FH\^CI28^FDBOX :^FS^CI27
^FT549,1170^A0N,41,40^FH\^CI28^FD{{ box_number }}^FS^CI27

^FT0,1036^A0N,31,30^FB851,1,8,C^FH\^CI28^FD{{ data.pt }}{{' ' }}{{ data.tujuan }}\5C&^FS^CI27
^FT493,1436^A0R,51,48^FH\^CI28^FD{{ data.instansi }}^FS^CI27
^FT291,1436^A0R,37,35^FH\^CI28^FD{{ data.alamat }}^FS^CI27
^FT416,1436^A0R,73,71^FH\^CI28^FD{{ data.tujuan }}^FS^CI27
^FT345,1436^A0R,51,48^FH\^CI28^FD{{ data.provinsi }}^FS^CI27
^FT238,1434^A0R,37,35^FH\^CI28^FDKONTAK : {{ data.kontak }}^FS^CI27
^PQ1,0,1,Y
^XZ
