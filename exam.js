(async function () {
  console.log("[Exam] init...");

  /* ===============================
   * 1. OPTIONAL: kontrol dari Supabase (autoExam)
   * =============================== */
  if (
    window.myAppData &&
    window.myAppData.flags &&
    window.myAppData.flags.autoExam === false
  ) {
    console.log("[Exam] autoExam disabled by Supabase");
    return;
  }

  /* ===============================
   * 2. Supabase client (reuse jika sudah ada)
   * =============================== */
  if (!window.supabase) {
    console.error("[Exam] Supabase client not found");
    return;
  }

  /* ===============================
   * 3. Fetch data dari Supabase
   * =============================== */
  const { data, error } = await supabase
    .from("reservasi_ujian")
    .select("jenis_ujian_kode, auto_flags")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    console.error("[Exam] gagal ambil data:", error);
    return;
  }

  console.log("[Exam] data Supabase:", data);

  const jenisUjianKode = data.jenis_ujian_kode;

  if (!jenisUjianKode) {
    console.log("[Exam] jenis_ujian_kode kosong");
    return;
  }

  /* ===============================
   * 4. Mapping listUjian
   * =============================== */
  const listUjian = {
    "F10-E10J": "JFT",
    "T20-J11J": "PM",
    "T10-J11J": "RESTO",
    "JH0-I11J": "KGINDO",
    "JH0-I12J": "KGJAPAN",
    "NC0-I11J": "PERTANIAN",
    "NC0-I12J": "PETERNAKAN"
  };

  const examKey = Object.keys(listUjian).find(
    key => listUjian[key] === jenisUjianKode
  );

  if (!examKey) {
    console.log("[Exam] Mapping tidak ditemukan untuk:", jenisUjianKode);
    return;
  }

  /* ===============================
   * 5. Simpan ke localStorage
   * =============================== */
  localStorage.setItem("exam", examKey);

  if (data.auto_flags?.autoExam !== undefined) {
    localStorage.setItem(
      "autoExam",
      JSON.stringify(data.auto_flags.autoExam)
    );
  }

  console.log("[Exam] localStorage.exam =", examKey);

  /* ===============================
   * 6. Auto select exam (opsional)
   * =============================== */
  let exam = examKey;

  // special case lama
  if (exam === "JH0-I12J") {
    exam = "JH0-J12J";
  }

  const examEl = document.querySelector(
    `#select1 > option[value="${exam}"]`
  );

  if (examEl) {
    examEl.selected = true;

    if (JSON.parse(localStorage.getItem("autoExam"))) {
      document.getElementById("test")?.click();
      console.log("[Exam] auto click test");
    }
  } else {
    console.log("[Exam] option exam tidak ditemukan di DOM");
  }

})();
