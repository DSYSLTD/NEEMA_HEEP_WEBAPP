import fs from 'fs';

let content = fs.readFileSync('src/components/MemberLoanCalculator.tsx', 'utf8');

content = content.replace(
`            </div>
        )}

        {/* STEP 2: AMOUNT */}`,
`            </div>
            </div>
        )}

        {/* STEP 2: AMOUNT */}`
);

content = content.replace(
`              <div className="flex gap-4">
                <button onClick={prevStep} className="w-1/3 py-3 font-bold border border-gray-200 rounded-xl text-gray-500">Back</button>
                <button onClick={nextStep} className="w-2/3 py-3 font-bold bg-[#004D40] text-white rounded-xl">Target Duration</button>
              </div>
        )}`,
`              <div className="flex gap-4">
                <button onClick={prevStep} className="w-1/3 py-3 font-bold border border-gray-200 rounded-xl text-gray-500">Back</button>
                <button onClick={nextStep} className="w-2/3 py-3 font-bold bg-[#004D40] text-white rounded-xl">Target Duration</button>
              </div>
            </div>
        )}`
);

content = content.replace(
`              <div className="flex gap-4">
                <button onClick={prevStep} className="w-1/3 py-3 font-bold border border-gray-200 rounded-xl text-gray-500">Back</button>
                <button onClick={nextStep} className="w-2/3 py-3 font-bold bg-[#004D40] text-white rounded-xl">Review Financials</button>
              </div>
        )}`,
`              <div className="flex gap-4">
                <button onClick={prevStep} className="w-1/3 py-3 font-bold border border-gray-200 rounded-xl text-gray-500">Back</button>
                <button onClick={nextStep} className="w-2/3 py-3 font-bold bg-[#004D40] text-white rounded-xl">Review Financials</button>
              </div>
            </div>
        )}`
);

fs.writeFileSync('src/components/MemberLoanCalculator.tsx', content);
console.log("Fixed MemberLoanCalculator 123");
