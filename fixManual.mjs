import fs from 'fs';

function replace(file, find, rep) {
    let content = fs.readFileSync(file, 'utf8');
    fs.writeFileSync(file, content.replace(find, rep));
}

// SimpleProcess.tsx
replace('src/components/SimpleProcess.tsx', 
`              </div>
         ))}
       </div>`, 
`              </div>
            </div>
         ))}
       </div>`);

replace('src/components/SimpleProcess.tsx', 
`</div>
</div>
  );
}`, 
`    </div>
  );
}`);

// TestimonialCarousel.tsx
replace('src/components/TestimonialCarousel.tsx',
`                  </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>`,
`                    </div>
                  </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>`);

replace('src/components/TestimonialCarousel.tsx',
`</div>
</div>
</div>
</section>
  );`,
`      </div>
    </section>
  );`);

// Registration.tsx
replace('src/pages/Registration.tsx',
`              </div>

            {/* Error Message */}`,
`              </div>  
            </div>

            {/* Error Message */}`);

replace('src/pages/Registration.tsx',
`</div>
</div>
</div>
</main>
  );`,
`    </main>
  );`);

console.log("Fixed part 1");
