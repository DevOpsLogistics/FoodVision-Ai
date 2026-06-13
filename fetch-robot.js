const https = require('https');
https.get('https://m7sport.vn/san-pham/giay-pickleball-lacoste-ag-lt23-ultra-white/', { rejectUnauthorized: false }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const matches = data.match(/https:\/\/[^"']+\.(png|gif|jpe?g|svg|webp)/gi);
    if(matches) {
       const unique = [...new Set(matches)];
       console.log(unique.filter(u => u.toLowerCase().includes('bot') || u.toLowerCase().includes('chat') || u.toLowerCase().includes('coze')));
    }
  });
});
