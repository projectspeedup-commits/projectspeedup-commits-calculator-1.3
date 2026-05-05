fetch("https://docs.google.com/spreadsheets/d/1Xb1vTwjUckLMD4W3_Fo_4bs-eeLhxRRw5tCL2D8KED4/export?format=csv&gid=0").then(res => res.text()).then(t => console.log(t))
