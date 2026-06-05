import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Calculator, Info, CheckCircle } from 'lucide-react';

interface MortgageCalculatorProps {
  lang: 'ar' | 'en';
}

export default function MortgageCalculator({ lang }: MortgageCalculatorProps) {
  const [price, setPrice] = useState<number>(1500000); // 1.5M SAR
  const [downpayment, setDownpayment] = useState<number>(300000); // 300k
  const [interest, setInterest] = useState<number>(4.25); // 4.25%
  const [years, setYears] = useState<number>(20); // 20 years

  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);

  useEffect(() => {
    const principal = price - downpayment;
    if (principal <= 0) {
      setMonthlyPayment(0);
      setTotalPayment(0);
      setTotalInterest(0);
      return;
    }

    const monthlyRate = (interest / 100) / 12;
    const totalMonths = years * 12;

    if (monthlyRate === 0) {
      const payment = principal / totalMonths;
      setMonthlyPayment(payment);
      setTotalPayment(principal);
      setTotalInterest(0);
    } else {
      const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                      (Math.pow(1 + monthlyRate, totalMonths) - 1);
      
      const total = payment * totalMonths;
      setMonthlyPayment(payment);
      setTotalPayment(total);
      setTotalInterest(total - principal);
    }
  }, [price, downpayment, interest, years]);

  // Format currency securely
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-[#FFFDF9]/90 dark:bg-[#0c0d12]/80 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-amber-500/15 dark:border-amber-400/10 shadow-lg" id="mortgage-calc-root">
      
      {/* Visual Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-amber-500/10 dark:bg-amber-400/10 rounded-2xl text-amber-550 dark:text-amber-400 border border-amber-500/10">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-[#2C211A] dark:text-amber-100">
            {lang === 'ar' ? 'حاسبة التمويل العقاري الذكية' : 'Smart Real Estate Finance Calculator'}
          </h3>
          <p className="text-xs text-amber-900/60 dark:text-amber-200/55 mt-0.5 font-medium">
            {lang === 'ar' ? 'خطط لميزانيتك واعرف قسطك الشهري المتوقع على الفور' : 'Plan your budget and instantly estimate your expected monthly installments'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sliders Input Segment */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Slider 1: Property Price */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm font-bold text-[#2C211A] dark:text-amber-100">
              <span>{lang === 'ar' ? 'سعر العقار التقريبي' : 'Approximate Property Price'}</span>
              <span className="text-amber-600 dark:text-amber-400 text-base font-black">{formatCurrency(price)}</span>
            </div>
            <input 
              type="range" 
              min={200000} 
              max={10000000} 
              step={50000}
              className="w-full accent-amber-500 cursor-pointer"
              value={price}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPrice(val);
                // Adjust downpayment if it exceeds price
                if (downpayment > val) {
                  setDownpayment(Math.floor(val * 0.2));
                }
              }}
            />
            <div className="flex justify-between text-[10px] text-amber-800/60 dark:text-amber-400/50 font-semibold">
              <span>200k SAR</span>
              <span>10M SAR</span>
            </div>
          </div>

          {/* Slider 2: Downpayment */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm font-bold text-[#2C211A] dark:text-amber-100">
              <span>{lang === 'ar' ? 'الدفعة الأولى المقدمة' : 'Downpayment'}</span>
              <span className="text-amber-600 dark:text-amber-400 text-base font-black">
                {formatCurrency(downpayment)} ({((downpayment / price) * 100).toFixed(0)}%)
              </span>
            </div>
            <input 
              type="range" 
              min={0} 
              max={Math.floor(price * 0.9)} 
              step={10000}
              className="w-full accent-amber-500 cursor-pointer"
              value={downpayment}
              onChange={(e) => setDownpayment(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-amber-800/60 dark:text-amber-400/50 font-semibold">
              <span>0 SAR</span>
              <span>{lang === 'ar' ? 'بحد أقصى 90% من القيمة' : 'Max 90% of value'}</span>
            </div>
          </div>

          {/* Grids with Tenure & Interest */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Slider 3: Interest rate */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm font-bold text-[#2C211A] dark:text-amber-100">
                <span>{lang === 'ar' ? 'نسبة المرابحة/الفائدة السنوية' : 'Annual Interest Rate'}</span>
                <span className="text-amber-600 dark:text-amber-400 text-base font-black">{interest}%</span>
              </div>
              <input 
                type="range" 
                min={1} 
                max={10} 
                step={0.05}
                className="w-full accent-amber-500 cursor-pointer"
                value={interest}
                onChange={(e) => setInterest(Number(e.target.value))}
              />
              <div className="flex justify-between text-[10px] text-amber-800/60 dark:text-amber-400/50 font-semibold">
                <span>1.0%</span>
                <span>10.0%</span>
              </div>
            </div>

            {/* Slider 4: Years Tenure */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm font-bold text-[#2C211A] dark:text-amber-100">
                <span>{lang === 'ar' ? 'مدة التمويل (سنوات)' : 'Loan Tenure (Years)'}</span>
                <span className="text-amber-600 dark:text-amber-400 text-base font-black">
                  {years} {lang === 'ar' ? 'سنة' : 'Years'}
                </span>
              </div>
              <input 
                type="range" 
                min={5} 
                max={30} 
                step={1}
                className="w-full accent-amber-500 cursor-pointer"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
              />
              <div className="flex justify-between text-[10px] text-amber-800/60 dark:text-amber-400/50 font-semibold">
                <span>5 {lang === 'ar' ? 'سنوات' : 'Years'}</span>
                <span>30 {lang === 'ar' ? 'سنة' : 'Years'}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Instantly Calculated Output Segment */}
        <div className="lg:col-span-5 bg-gradient-to-br from-amber-500/5 to-[#FCFAF5]/5 dark:from-[#06070a] dark:to-[#0c0d12]/45 p-6 rounded-3xl border border-amber-500/15 dark:border-amber-400/15 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <span className="text-[11px] font-black tracking-widest text-amber-800/80 dark:text-amber-400/70 block uppercase">
              {lang === 'ar' ? 'التفاصيل المالية لملف التمويل' : 'Financial Statement Overview'}
            </span>
            
            {/* Monthly Installment Showbox */}
            <div className="bg-amber-500/5 dark:bg-[#07080a]/60 border border-amber-500/15 dark:border-amber-400/10 p-5 rounded-2xl text-center">
              <span className="text-xs text-amber-900/60 dark:text-amber-400/60 block font-bold">
                {lang === 'ar' ? 'دفعتك الشهرية المتوقعة' : 'Estimated Monthly Installment'}
              </span>
              <div className="text-2xl md:text-3xl font-black text-amber-800 dark:text-transparent bg-clip-text bg-gradient-to-r dark:from-amber-200 dark:to-yellow-450 mt-2 truncate">
                {formatCurrency(monthlyPayment)}
              </div>
            </div>

            {/* Minor Items Row */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-amber-500/5 dark:bg-[#07080a]/60 border border-amber-500/10 dark:border-amber-400/10 p-4 rounded-xl">
                <span className="text-[10px] text-amber-800/60 dark:text-amber-400/50 block font-bold">{lang === 'ar' ? 'إجمالي مبلغ التمويل' : 'Finance Principal'}</span>
                <strong className="text-xs text-amber-950 dark:text-amber-100 mt-1 block font-black">
                  {formatCurrency(price - downpayment)}
                </strong>
              </div>
              <div className="bg-amber-500/5 dark:bg-[#07080a]/60 border border-amber-500/10 dark:border-amber-400/10 p-4 rounded-xl">
                <span className="text-[10px] text-amber-800/60 dark:text-amber-400/50 block font-bold">{lang === 'ar' ? 'إجمالي الأرباح المضافة' : 'Total Interest Charged'}</span>
                <strong className="text-xs text-amber-600 dark:text-amber-450 mt-1 block font-black">
                  {formatCurrency(totalInterest)}
                </strong>
              </div>
            </div>

            <div className="text-[11px] flex gap-2 text-amber-900/80 dark:text-amber-300/80 font-medium leading-relaxed bg-amber-500/5 dark:bg-[#07080a]/40 p-3 rounded-xl border border-amber-500/10">
              <Info className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>
                {lang === 'ar' 
                  ? 'هذه حاسبة تقديرية تقريبية. قد تختلف النسب الفعلية بحسب الراتب والقطاع المعتمد طبقاً للأنظمة واللوائح.' 
                  : 'This is an approximate estimate. Real interest percentages may fluctuate depending on salary scales.'}
              </span>
            </div>
          </div>

          <button 
            onClick={() => {
              alert(
                lang === 'ar' 
                  ? `تم حفظ عرض التمويل بقسط قدره ${formatCurrency(monthlyPayment)} شهرياً. سيتم دراسة الطلب وإعطائك الضوء الأخضر!` 
                  : `Finance proposal with ${formatCurrency(monthlyPayment)}/Month saved successfully.`
              );
            }}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs md:text-sm rounded-2xl transition-all hover:from-amber-600 hover:to-yellow-600 shadow-md shadow-amber-500/10 hover:shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4 text-slate-950" />
            <span>{lang === 'ar' ? 'تقديم طلب تمويل عقاري معتمد' : 'Submit for pre-approved corporate finance'}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
