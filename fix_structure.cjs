const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Fix the start of the conditional block
content = content.replace(
    /\{filteredMatchedDemand\.length > 0 && \(\s*(?:<>\s*)?<div className="p-4 sm:p-6/,
    '{filteredMatchedDemand.length > 0 && (\n                            <>\n                              <div className="p-4 sm:p-6'
);

// Fix the middle part (extra div around 3042)
content = content.replace(
    /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div className="bg-white dark:bg-\[#1A1C19\] border border-slate-200/,
    '</div>\n                                </div>\n                              </div>\n                            </div>\n                              \n                              <div className="bg-white dark:bg-[#1A1C19] border border-slate-200'
);

// Fix the end of the block
content = content.replace(
    /<\/tbody>\s*<\/table>\s*<\/div>\s*(?:<\/div>\s*)*\s*\}\)\}\s*(?:<\/Fragment>\s*)?<\/tbody>\s*<\/table>\s*<\/div>\s*(?:<\/div>\s*)*\s*\}\)\}\s*<\/tbody>/,
    '</tbody></table></div></div></>)}</motion.div>'
);
// Above regex is too complex. Let's do something simpler.

const tableEndPattern = /<\/tbody>\s*<\/table>\s*<\/div>\s*<\/div>\s*\)\}\s*<\/motion\.div>/;
if (tableEndPattern.test(content)) {
    console.log("Found table end, fixing it to include fragment");
    content = content.replace(tableEndPattern, "</tbody>\n                            </table>\n                          </div>\n                        </div>\n                        </>\n                      )}\n                    </motion.div>");
}

fs.writeFileSync('src/components/AdminPanel.tsx', content);
