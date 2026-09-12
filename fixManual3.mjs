import fs from 'fs';

function replace(file, search, rep) {
    let content = fs.readFileSync(file, 'utf8');
    fs.writeFileSync(file, content.replace(search, rep));
}

replace('src/pages/ContactUs.tsx',
`                  </div>
              </div>
            ))}
          </div>`,
`                  </div>
                </div>
              </div>
            ))}
          </div>`);

replace('src/pages/ContactUs.tsx',
`              <div className="absolute top-0 right-0 w-64 h-64 bg-[#32CD32] rounded-full blur-[100px] opacity-10 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#32CD32] rounded-full blur-[100px] opacity-10 pointer-events-none" />
          </div>
      </div>
</div>
</div>
</div>
</section>
    </main>
  );
}`,
`              </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#32CD32] rounded-full blur-[100px] opacity-10 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#32CD32] rounded-full blur-[100px] opacity-10 pointer-events-none" />
          </div>
        </div>
      </section>
    </main>
  );
}`);

console.log("Fixed part 3");
