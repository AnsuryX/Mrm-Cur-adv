// Simple booking client script
(function(){
  const slotsEl = document.getElementById('slots');
  const dateInput = document.getElementById('date');
  const slotInput = document.getElementById('slot');
  const form = document.getElementById('bookingForm');
  const msg = document.getElementById('message');

  const SLOTS = [...Array(7).keys()].map(i => {
    const hour = 9 + i; // 9..15 => last slot 15:00-16:00
    return (hour<10? '0'+hour : ''+hour) + ':00';
  });

  function createSlotButton(time, busy){
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'rounded-xl px-3 py-2 border text-sm font-medium';
    if (busy) {
      btn.classList.add('bg-gray-100','text-gray-400','border-gray-200');
      btn.disabled = true;
      btn.textContent = time + ' — Booked';
    } else {
      btn.classList.add('bg-white','text-gray-800','border-gray-200','hover:bg-accent/10');
      btn.textContent = time;
      btn.addEventListener('click', ()=>{
        // clear selection
        document.querySelectorAll('#slots button').forEach(b=>b.classList.remove('ring','ring-accent'));
        btn.classList.add('ring','ring-accent');
        slotInput.value = time;
      });
    }
    return btn;
  }

  async function fetchSlots(date){
    slotsEl.innerHTML = 'Loading...';
    try{
      const res = await fetch(`/.netlify/functions/get-availability?date=${date}`);
      const json = await res.json();
      const busy = json.busySlots || [];
      slotsEl.innerHTML = '';
      SLOTS.forEach(s => slotsEl.appendChild(createSlotButton(s, busy.includes(s)));
      );
    }catch(e){
      slotsEl.innerHTML = '<div class="text-sm text-red-500">Unable to load availability</div>';
      console.error(e);
    }
  }

  // initialize date to today
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth()+1).padStart(2,'0');
  const dd = String(today.getDate()).padStart(2,'0');
  dateInput.value = `${yyyy}-${mm}-${dd}`;
  fetchSlots(dateInput.value);

  dateInput.addEventListener('change', ()=>{
    slotInput.value = '';
    fetchSlots(dateInput.value);
  });

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    msg.textContent = '';
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const date = dateInput.value;
    const slot = slotInput.value;
    if (!slot){ msg.textContent = 'Please pick a time slot.'; return; }

    const payload = { name, email, phone, date, slot };
    document.getElementById('submit').disabled = true;
    try{
      const res = await fetch('/.netlify/functions/create-event', {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.status === 200) {
        msg.innerHTML = `<div class="text-green-700">Booked! Confirmation: ${data.summary || ''} <br/><a href="${data.htmlLink || '#'}" target="_blank" class="text-accent underline">Add to calendar / view event</a></div>`;
        // refresh slots
        fetchSlots(date);
      } else if (res.status === 409) {
        msg.innerHTML = `<div class="text-red-600">Slot already booked. Please pick another slot.</div>`;
        fetchSlots(date);
      } else {
        msg.innerHTML = `<div class="text-red-600">Booking failed: ${data.error || 'Unknown error'}</div>`;
      }
    }catch(err){
      console.error(err);
      msg.innerHTML = `<div class="text-red-600">Network error while booking. Try again.</div>`;
    } finally { document.getElementById('submit').disabled = false; }
  });
})();
