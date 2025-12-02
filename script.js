// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
if (prefersLight) document.body.classList.add('light');

const setThemeIcon = () => {
  themeToggle.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
};
setThemeIcon();

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  setThemeIcon();
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Workout plans data
const plans = [
  {
    title: 'Beginner Full Body',
    level: 'Beginner',
    duration: '4 weeks',
    focus: ['Form', 'Consistency'],
    workouts: ['Squat', 'Push-ups', 'Row', 'Plank', 'Glute bridge']
  },
  {
    title: 'Lean & Endurance',
    level: 'Intermediate',
    duration: '6 weeks',
    focus: ['Cardio', 'Volume'],
    workouts: ['HIIT circuits', 'Tempo runs', 'Kettlebell swings', 'Core finishers']
  },
  {
    title: 'Strength Builder',
    level: 'Intermediate',
    duration: '8 weeks',
    focus: ['Progressive overload', 'Compound lifts'],
    workouts: ['Deadlift', 'Bench press', 'Pull-ups', 'Lunges', 'Farmer’s carry']
  }
];

const planCards = document.getElementById('planCards');
plans.forEach(plan => {
  const el = document.createElement('article');
  el.className = 'card';
  el.innerHTML = `
    <h3>${plan.title}</h3>
    <p class="muted"><strong>Level:</strong> ${plan.level} • <strong>Duration:</strong> ${plan.duration}</p>
    <p><strong>Focus:</strong> ${plan.focus.join(', ')}</p>
    <ul>${plan.workouts.map(w => `<li>${w}</li>`).join('')}</ul>
    <button class="selectPlan">Add to schedule</button>
  `;
  el.querySelector('.selectPlan').addEventListener('click', () => {
    // Quick add to Monday for demo
    addWorkout('Monday', `${plan.title} - Session`);
  });
  planCards.appendChild(el);
});

// BMI calculator
const bmiForm = document.getElementById('bmiForm');
const bmiResult = document.getElementById('bmiResult');

bmiForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const h = parseFloat(document.getElementById('height').value);
  const w = parseFloat(document.getElementById('weight').value);
  if (!h || !w || h < 100 || w < 30) {
    bmiResult.textContent = 'Please enter realistic height and weight.';
    return;
  }
  const hm = h / 100;
  const bmi = w / (hm * hm);
  let label = 'Normal';
  if (bmi < 18.5) label = 'Underweight';
  else if (bmi < 25) label = 'Normal';
  else if (bmi < 30) label = 'Overweight';
  else label = 'Obese';

  bmiResult.textContent = `BMI: ${bmi.toFixed(1)} (${label})`;
});

// Schedule with localStorage
const scheduleGrid = document.getElementById('scheduleGrid');
const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

function loadSchedule() {
  const data = JSON.parse(localStorage.getItem('fitflow_schedule') || '{}');
  return data;
}

function saveSchedule(data) {
  localStorage.setItem('fitflow_schedule', JSON.stringify(data));
}

function renderSchedule() {
  const data = loadSchedule();
  scheduleGrid.innerHTML = '';
  days.forEach(day => {
    const dayEl = document.createElement('div');
    dayEl.className = 'day';
    dayEl.innerHTML = `<h4>${day}</h4>`;
    const list = document.createElement('div');
    (data[day] || []).forEach((item, idx) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'item' + (item.completed ? ' completed' : '');
      itemEl.innerHTML = `
        <span>${item.name}</span>
        <div>
          <button class="toggle">${item.completed ? '↺' : '✓'}</button>
          <button class="delete">✕</button>
        </div>
      `;
      itemEl.querySelector('.toggle').addEventListener('click', () => {
        item.completed = !item.completed;
        data[day][idx] = item;
        saveSchedule(data);
        renderSchedule();
      });
      itemEl.querySelector('.delete').addEventListener('click', () => {
        data[day].splice(idx, 1);
        saveSchedule(data);
        renderSchedule();
      });
      list.appendChild(itemEl);
    });
    dayEl.appendChild(list);
    scheduleGrid.appendChild(dayEl);
  });
}

function addWorkout(day, name) {
  const data = loadSchedule();
  if (!data[day]) data[day] = [];
  data[day].push({ name, completed: false });
  saveSchedule(data);
  renderSchedule();
}

renderSchedule();

// Add workout form
document.getElementById('addWorkoutForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const day = document.getElementById('daySelect').value;
  const name = document.getElementById('workoutInput').value.trim();
  if (!name) return;
  addWorkout(day, name);
  e.target.reset();
});

// Contact form (demo)
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const status = document.getElementById('contactStatus');

  if (!name || !email || !message) {
    status.textContent = 'Please fill in all fields.';
    return;
  }
  // Demo only: no network request
  status.textContent = 'Thanks! We’ll get back to you soon.';
  e.target.reset();
});