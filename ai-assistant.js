(function(){
  // Enhanced on-page assistant with multilingual greeting detection and email fallback
  const assistantBtn = document.createElement('div');
  assistantBtn.className = 'assistant-btn';
  assistantBtn.title = 'Ask KC Bandoy';
  assistantBtn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a7 7 0 00-7 7v3a7 7 0 007 7 7 7 0 007-7V9a7 7 0 00-7-7z" fill="#001233"/><path d="M8 21c0 .667 1.333 1 4 1s4-.333 4-1" stroke="#001233" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(assistantBtn);

  const win = document.createElement('div');
  win.className = 'assistant-window';
  win.innerHTML = `
    <header>Ask KC</header>
    <div class="assistant-messages" id="assistantMessages">
      <div class="assistant-msg kc">Hi! I'm KC's assistant. Ask me about programs, volunteering, or events.</div>
    </div>
    <div class="assistant-input">
      <input id="assistantInput" placeholder="Type your question..." aria-label="Ask KC a question">
      <button id="assistantSend" class="btn-premium" style="padding:8px 10px;">Send</button>
    </div>
    <div class="assistant-footer-note">If I can't answer, I can forward your question to KC privately.</div>
    <a id="assistantEmail" href="#" style="display:none;">hidden</a>
  `;
  document.body.appendChild(win);

  function toggleWindow(){
    if (win.style.display === 'flex') { win.style.display = 'none'; }
    else { win.style.display = 'flex'; document.getElementById('assistantInput').focus(); }
  }

  assistantBtn.addEventListener('click', toggleWindow);

  const sendBtn = win.querySelector('#assistantSend');
  const input = win.querySelector('#assistantInput');
  const messages = win.querySelector('#assistantMessages');
  const emailLink = win.querySelector('#assistantEmail');

  // Basic FAQ set (keyword -> answer)
  const faqs = [
    { q: ['volunteer','volunte','volunteer program'], a: 'Para maging volunteer, sumali sa aming Monthly Youth Forum o mag-email sa bandoykc6@gmail.com.' },
    { q: ['workshop','training','leadership workshop'], a: 'Ang mga training at leadership workshops ay ina-anunsyo sa aming Live Feed section at sa Facebook page ni KC.' },
    { q: ['contact','phone','email','mobile','number'], a: 'Maaari mong tawagan si KC sa 0951 818 2771 o mag-email sa bandoykc6@gmail.com.' },
    { q: ['education','school','bsed','college','course'], a: 'Si KC ay kasalukuyang nasa 2nd Year ng Bachelor of Secondary Education major in English.' },
    { q: ['events','community','clean-up','clean up'], a: 'Tignan ang Updates section para sa mga ginagawa nating community clean-up drive at iba pang aktibidad.' },
    { q: ['address','location','taga saan','saan nakatira'], a: 'Si KC ay taga Centro, Sibulan, Sta. Cruz, Davao del Sur.' },
    { q: ['birthday','birthdate','kailan ipinanganak','edad','age'], a: 'Si KC ay ipinanganak noong March 25, 2005.' },
    { q: ['who is kc','sino si kc','about kc','tungkol kay kc'], a: 'Si KC Grace O. Bandoy ay ang kasalukuyang Sangguniang Kabataan Chairperson sa Centro, Sibulan. Siya rin ay isang Education student na mahilig sa community leadership.' }
  ];

  // Multilingual greeting mapping (patterns -> language code)
  const greetingMap = [
    { langs: ['en'], patterns: ['hi','hello','hey','hiya','yo'] , reply: 'Hi! How can I help you today?'} ,
    { langs: ['tl','ph'], patterns: ['kamusta','kamusta ka','kumusta','kamusta po','magandang araw','magandang umaga','nag hi','nag-hi','naghi'], reply: 'Kamusta! Paano kita matutulungan?' },
    { langs: ['ceb'], patterns: ['kumusta','kumusta ka','kamusta'], reply: 'Kumusta! Unsaon nako pagtabang nimo?' },
    { langs: ['es'], patterns: ['hola','buenas'], reply: '¡Hola! ¿En qué puedo ayudar?' },
    { langs: ['zh'], patterns: ['你好','您好','nǐ hǎo','nihao'], reply: '你好！我能幫你做什麼？' },
    { langs: ['ja'], patterns: ['こんにちは','konnichiwa'], reply: 'こんにちは！何かお手伝いしましょうか？' },
    { langs: ['ko'], patterns: ['안녕하세요','annyeonghaseyo'], reply: '안녕하세요! 무엇을 도와드릴까요?' },
    { langs: ['fr'], patterns: ['bonjour','salut'], reply: 'Salut! Comment puis-je aider?' },
    { langs: ['pt'], patterns: ['olá','ola','oi'], reply: 'Olá! Como posso ajudar?' },
    { langs: ['it'], patterns: ['ciao','salve'], reply: 'Ciao! Come posso aiutare?' },
    { langs: ['ar'], patterns: ['مرحبا','مرحبا بك','ahlan'], reply: 'مرحبا! كيف أستطيع المساعدة؟' },
    { langs: ['de'], patterns: ['hallo','guten tag'], reply: 'Hallo! Wie kann ich helfen?' },
    { langs: ['ru'], patterns: ['привет','Здравствуйте','privet'], reply: 'Привет! Чем могу помочь?' }
  ];

  const supportedLanguages = ['English','Tagalog','Cebuano','Spanish','Chinese','Japanese','Korean','French','Portuguese','Italian','Arabic','German','Russian'];

  function addMessage(text, cls){
    const div = document.createElement('div');
    div.className = 'assistant-msg ' + cls;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function detectGreeting(text){
    const t = text.toLowerCase();
    for (const entry of greetingMap){
      for (const p of entry.patterns){
        if (t.includes(p)) return entry.reply;
      }
    }
    return null;
  }

  function findAnswer(text){
    const t = text.toLowerCase();

    // 1) Language inquiry
    if (t.includes('what languages') || t.includes('what languages do you know') || t.includes('ano ang mga wika') || t.includes('anong mga wika') || t.includes('languages do you know') || t.includes('mga wika')){
      return 'I can communicate in: ' + supportedLanguages.join(', ') + '. If you greet me, I will reply in that language when possible.';
    }

    // 2) Updates / feed queries (Facebook)
    if (t.includes('update') || t.includes('latest') || t.includes("what's new") || t.includes('recent') || t.includes('balita') || t.includes('ganap') || t.includes('anong bago') || t.includes('ano ang bago')){
      return 'Para sa pinakabagong updates at anunsyo, maaari mong bisitahin ang aking Facebook profile dito: https://www.facebook.com/profile.php?id=61581987389724. Maraming salamat!';
    }

    // 3) FAQ keywords
    for (const item of faqs){
      for (const k of item.q){
        if (t.includes(k)) return item.a;
      }
    }

    // 4) Greeting detection (as fallback)
    const greet = detectGreeting(text);
    if (greet) return greet;

    return null;
  }

  function handleSend(){
    const val = input.value.trim();
    if (!val) return;
    addMessage(val, 'user');
    const answer = findAnswer(val);
    if (answer){
      setTimeout(()=> addMessage(answer, 'kc'), 400);
    } else {
      setTimeout(()=> addMessage("I'm not sure about that. I can forward your question to KC via email." , 'kc'), 500);
      // prepare mailto
      const subject = encodeURIComponent('Question from portfolio visitor');
      const body = encodeURIComponent('Question: ' + val + '\n\nPlease reply when possible.');
      emailLink.href = `mailto:bandoykc6@gmail.com?subject=${subject}&body=${body}`;
    }
    input.value = '';
    input.focus();
  }

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', function(e){ if (e.key === 'Enter') handleSend(); });

})();
