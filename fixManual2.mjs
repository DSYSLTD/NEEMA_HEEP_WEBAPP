import fs from 'fs';

function replace(file, search, rep) {
    let content = fs.readFileSync(file, 'utf8');
    fs.writeFileSync(file, content.replace(search, rep));
}

replace('src/components/LoanCalculator.tsx',
`                  <p className="text-red-600 font-medium">{output.error}</p>
                </div>
            ) : (`,
`                  <p className="text-red-600 font-medium">{output.error}</p>
                </div>
              </div>
            ) : (`);

replace('src/components/LoanCalculator.tsx',
`                      <Info className="w-4 h-4 mt-0.5 text-[#32CD32] shrink-0" />
                      <div>{output.warnings[0]}</div>
                  )}`,
`                      <Info className="w-4 h-4 mt-0.5 text-[#32CD32] shrink-0" />
                      <div>{output.warnings[0]}</div>
                    </div>
                  )}`);

replace('src/components/LoanCalculator.tsx',
`</div>
</div>
</div>
</div>
</div>
</div>
</section>`,
`    </section>`);

replace('src/components/MemberLoanCalculator.tsx',
`                  <p className="text-red-600 font-medium">{output.error}</p>
                </div>
            ) : (`,
`                  <p className="text-red-600 font-medium">{output.error}</p>
                </div>
              </div>
            ) : (`);

replace('src/components/MemberLoanCalculator.tsx',
`                      <Info className="w-4 h-4 mt-0.5 text-[#32CD32] shrink-0" />
                      <div>{output.warnings[0]}</div>
                  )}`,
`                      <Info className="w-4 h-4 mt-0.5 text-[#32CD32] shrink-0" />
                      <div>{output.warnings[0]}</div>
                    </div>
                  )}`);

replace('src/components/MemberLoanCalculator.tsx',
`</div>
</div>
</div>
</div>
</div>
</div>
</section>`,
`    </section>`);

console.log("Fixed part 2");
