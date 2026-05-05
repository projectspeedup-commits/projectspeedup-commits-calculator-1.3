const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Find the end of the header section for calc-stock
const headerEnd = 'Скачать Excel\\n                              </button>\\n                            </div>\\n                          </div>';
const headerEndPattern = /Скачать Excel\s*<\/button>\s*<\/div>\s*<\/div>/;

if (headerEndPattern.test(content)) {
    console.log("Found header end");
    content = content.replace(headerEndPattern, "Скачать Excel</button></div></div></div>");
} else {
    console.log("Header end NOT found");
}

// Find the fragment end
const fragEndPattern = /<\/table>\s*<\/div>\s*<\/div>\s*<(?:\/|Fragment)>\s*\)\}/;
// Actually let's be more specific based on the view_file output
// 3257: </table>
// 3258: </div>
// 3259: </div>
// 3260: </>
// 3261: )}

const exactFragEnd = /<\/table>\s*<\/div>\s*<\/div>\s*<(?:\/|Fragment)?\s*>\s*\)\}\s*<\/motion\.div>/;

if (exactFragEnd.test(content)) {
    console.log("Found fragment end");
    // We already closed the extra div at line 2995 in our plan, 
    // so here we should have </table></div></div></>)}</motion.div> 
    // Wait, if I added one at 2995, then I should REMOVE one here.
    content = content.replace(exactFragEnd, "</table></div></div></>)}</motion.div>");
    // Wait, if I have </table> (3257), </div> (3258), </div> (3259), then 3259 was closing A.
    // If I close A at 2995, then 3259 is extra.
    // So </table></div></div> matches 3257 and 3258. 3259 should be REMOVED.
} else {
    console.log("Fragment end NOT found");
}

fs.writeFileSync('src/components/AdminPanel.tsx', content);
