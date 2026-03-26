import { useState, FormEvent } from 'react';
import { AlertCircle, CheckCircle, ClipboardList, RotateCcw, ChevronRight } from 'lucide-react';

// Knowledge Base - Mapping symptoms to faults
const faultTypes = {
  A1: 'Monitor Rusak',
  A2: 'Memori Rusak',
  A3: 'HDD Rusak',
  A4: 'VGA Rusak',
  A5: 'Sound Card Rusak',
  A6: 'OS Bermasalah',
  A7: 'Aplikasi Rusak',
  A8: 'PSU Rusak',
  A9: 'Prosesor Rusak',
  A10: 'Memory Kurang (Perlu Upgrade Memory)',
  A11: 'Memory VGA Kurang (Perlu Upgrade VGA)',
  A12: 'Clock Prosesor Kurang Tinggi (Perlu Upgrade Prosesor)',
  A13: 'Kabel IDE Rusak',
  A14: 'Kurang Daya pada PSU (Perlu Upgrade PSU)',
  A15: 'Perangkat USB Rusak',
  A16: 'Keyboard Rusak',
  A17: 'Mouse Rusak',
};

interface Symptom {
  code: string;
  description: string;
  faults: string[];
}

const symptoms: Symptom[] = [
  { code: 'B1', description: 'Tidak ada gambar tertampil di monitor', faults: ['A1', 'A4', 'A8'] },
  { code: 'B2', description: 'Terdapat garis horisontal / vertikal ditengah monitor', faults: ['A1'] },
  { code: 'B3', description: 'Tidak ada tampilan awal bios', faults: ['A2', 'A4', 'A8'] },
  { code: 'B4', description: 'Muncul pesan error pada bios (isi pesan selalu berbeda tergantung pada kondisi tertentu)', faults: ['A2', 'A8'] },
  { code: 'B5', description: 'Alarm bios berbunyi', faults: ['A2', 'A4', 'A8', 'A15'] },
  { code: 'B6', description: 'Terdengar suara aneh pada HDD', faults: ['A3'] },
  { code: 'B7', description: 'Sering terjadi hang/crash saat menjalankan aplikasi', faults: ['A3', 'A7'] },
  { code: 'B8', description: 'Selalu Scandisk ketika booting', faults: ['A3'] },
  { code: 'B9', description: 'Muncul pesan error saat menjalankan game atau aplikasi grafis', faults: ['A4', 'A11'] },
  { code: 'B10', description: 'Device driver informasi tidak terdeteksi dalam device manager, meski driver telah di install', faults: ['A3', 'A4', 'A5', 'A15', 'A16', 'A17'] },
  { code: 'B11', description: 'Tiba-tiba OS melakukan restart otomatis', faults: ['A2', 'A6'] },
  { code: 'B12', description: 'Keluarnya blue screen pada OS Windows (isi pesan selalu berbeda tergantung pada kondisi tertentu)', faults: ['A2', 'A4', 'A6', 'A7'] },
  { code: 'B13', description: 'Suara tetap tidak keluar meskipun driver dan setting device telah dilakukan sesuai petunjuk', faults: ['A5', 'A5'] },
  { code: 'B14', description: 'Muncul pesan error saat menjalankan aplikasi audio', faults: ['A5'] },
  { code: 'B15', description: 'Muncul pesan error saat pertama OS di load dari HDD', faults: ['A6'] },
  { code: 'B16', description: 'Tidak ada tanda-tanda dari sebagian/seluruh perangkat bekerja (semua kipas pendingin tidak berputar)', faults: ['A8'] },
  { code: 'B17', description: 'Sering tiba-tiba mati tanpa sebab', faults: ['A8'] },
  { code: 'B18', description: 'Muncul pesan pada windows, bahwa windows kekurangan virtual memori', faults: ['A9'] },
  { code: 'B19', description: 'Aplikasi berjalan dengan lambat, respon yang lambat terhadap inputan', faults: ['A10', 'A12'] },
  { code: 'B20', description: 'Kinerja grafis terasa sangat berat (biasanya dlm game dan manipulasi gambar)', faults: ['A11'] },
  { code: 'B21', description: 'Device tidak terdeteksi dalam bios', faults: ['A3', 'A13'] },
  { code: 'B22', description: 'Informasi deteksi yang salah dalam bios', faults: ['A3'] },
  { code: 'B23', description: 'Hanya sebagian perangkat yang bekerja', faults: ['A14'] },
  { code: 'B24', description: 'Sebagian/seluruh karakter inputan mati', faults: ['A16'] },
  { code: 'B25', description: 'Pointer mouse tidak merespon gerakan mouse', faults: ['A17'] },
];

interface DiagnosisResult {
  code: string;
  name: string;
  count: number;
  confidence: number;
}

export default function App() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult[]>([]);

  const handleCheckboxChange = (code: string, checked: boolean) => {
    setAnswers(prev => ({
      ...prev,
      [code]: checked,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const selectedSymptoms = Object.entries(answers)
      .filter(([_, value]) => value)
      .map(([code, _]) => code);

    if (selectedSymptoms.length === 0) {
      alert('Silakan pilih minimal satu gejala kerusakan');
      return;
    }

    const faultCounts: Record<string, number> = {};

    symptoms.forEach(symptom => {
      if (answers[symptom.code]) {
        symptom.faults.forEach(fault => {
          faultCounts[fault] = (faultCounts[fault] || 0) + 1;
        });
      }
    });

    const results = Object.entries(faultCounts)
      .map(([code, count]) => ({
        code,
        name: faultTypes[code as keyof typeof faultTypes],
        count,
        confidence: (count / selectedSymptoms.length) * 100,
      }))
      .sort((a, b) => b.count - a.count);

    setDiagnosis(results);
    setShowResults(true);

    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
    setDiagnosis([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const answeredCount = Object.values(answers).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-6 px-4 shadow-lg">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-center mb-2">Sistem Pakar Deteksi Kerusakan Komputer</h1>
          <p className="text-center opacity-90">Formulir Diagnosis Kerusakan Hardware & Software</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="bg-card rounded-lg shadow-md border border-border mb-6">
          <div className="p-4 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ClipboardList className="w-6 h-6 text-primary" />
                <div>
                  <h2>Formulir Gejala Kerusakan</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Centang gejala yang Anda alami pada komputer Anda
                  </p>
                </div>
              </div>
              {answeredCount > 0 && (
                <div className="text-right">
                  <div className="text-2xl text-primary">{answeredCount}</div>
                  <div className="text-xs text-muted-foreground">Gejala dipilih</div>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {symptoms.map((symptom, index) => (
                  <label
                    key={symptom.code}
                    className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                      answers[symptom.code]
                        ? 'bg-primary/5 border-primary shadow-sm'
                        : 'bg-card border-border hover:bg-accent/30'
                    }`}
                  >
                    <div className="flex items-center pt-1">
                      <input
                        type="checkbox"
                        checked={answers[symptom.code] || false}
                        onChange={(e) => handleCheckboxChange(symptom.code, e.target.checked)}
                        className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-ring cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 bg-muted rounded font-mono">
                          {symptom.code}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Pertanyaan {index + 1} dari {symptoms.length}
                        </span>
                      </div>
                      <p className="leading-relaxed">{symptom.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-border bg-muted/20">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  {answeredCount === 0
                    ? 'Pilih minimal 1 gejala untuk mendapatkan diagnosis'
                    : `${answeredCount} gejala telah dipilih`}
                </p>
                <div className="flex gap-3">
                  {answeredCount > 0 && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
                  >
                    Diagnosis
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {showResults && (
          <div id="results-section" className="bg-card rounded-lg shadow-md border border-border">
            <div className="p-4 border-b border-border bg-primary/5">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-primary" />
                <div>
                  <h2>Hasil Diagnosis</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Berdasarkan {answeredCount} gejala yang dipilih
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {diagnosis.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Tidak dapat menentukan diagnosis</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-accent/30 border border-border rounded-lg p-4 mb-4">
                    <h3 className="mb-2">Kemungkinan Kerusakan Terdeteksi</h3>
                    <p className="text-sm text-muted-foreground">
                      Sistem telah menganalisis gejala dan menemukan {diagnosis.length} kemungkinan kerusakan.
                      Berikut hasil diagnosis diurutkan berdasarkan tingkat kemungkinan tertinggi:
                    </p>
                  </div>

                  {diagnosis.map((result, index) => (
                    <div
                      key={result.code}
                      className={`rounded-lg border p-5 transition-all ${
                        index === 0
                          ? 'bg-primary/5 border-primary shadow-md ring-2 ring-primary/20'
                          : 'bg-card border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {index === 0 && (
                              <span className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded">
                                ⭐ Paling Mungkin
                              </span>
                            )}
                            <span className="text-xs px-2 py-1 bg-muted rounded font-mono">
                              {result.code}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              #{index + 1}
                            </span>
                          </div>
                          <h3 className="mb-2">{result.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Cocok dengan {result.count} dari {answeredCount} gejala yang Anda pilih
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-3xl mb-1">
                            {Math.round(result.confidence)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Confidence</div>
                        </div>
                      </div>

                      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            index === 0 ? 'bg-primary' : 'bg-primary/60'
                          }`}
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="mt-6 p-5 bg-accent/30 border border-border rounded-lg">
                    <h4 className="mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-primary" />
                      Rekomendasi Tindakan
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Periksa komponen yang terindikasi rusak secara fisik</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Coba ganti komponen dengan yang berfungsi untuk memastikan diagnosis</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Backup data penting sebelum melakukan perbaikan</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Jika masalah berlanjut, konsultasikan dengan teknisi profesional</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 text-center">
                    <button
                      onClick={handleReset}
                      className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors inline-flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Diagnosis Baru
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
