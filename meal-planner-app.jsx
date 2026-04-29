import React, { useState, useEffect } from 'react';
import { Download, Share2, RefreshCw, Trash2, Plus } from 'lucide-react';

const MealPlannerApp = () => {
  // Form state
  const [weight, setWeight] = useState('170');
  const [height, setHeight] = useState('70');
  const [age, setAge] = useState('30');
  const [sex, setSex] = useState('male');
  const [goal, setGoal] = useState('maintenance');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [unit, setUnit] = useState('imperial');

  // Calculated state
  const [tdee, setTdee] = useState(null);
  const [macros, setMacros] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [groceryList, setGroceryList] = useState(null);
  const [shareUrl, setShareUrl] = useState('');

  // Meal database
  const mealDatabase = {
    breakfast: [
      { name: 'Oatmeal with berries', protein: 10, carbs: 45, fat: 3 },
      { name: 'Eggs + toast', protein: 18, carbs: 30, fat: 12 },
      { name: 'Greek yogurt + granola', protein: 20, carbs: 35, fat: 5 },
      { name: 'Protein pancakes', protein: 25, carbs: 40, fat: 8 },
      { name: 'Smoothie bowl', protein: 15, carbs: 50, fat: 6 },
      { name: 'Cottage cheese + fruit', protein: 22, carbs: 25, fat: 4 },
    ],
    lunch: [
      { name: 'Chicken breast + rice', protein: 40, carbs: 50, fat: 5 },
      { name: 'Turkey sandwich', protein: 30, carbs: 40, fat: 8 },
      { name: 'Tuna salad', protein: 35, carbs: 15, fat: 10 },
      { name: 'Beef tacos', protein: 35, carbs: 45, fat: 15 },
      { name: 'Salmon + sweet potato', protein: 35, carbs: 40, fat: 12 },
      { name: 'Tofu stir-fry', protein: 28, carbs: 45, fat: 8 },
    ],
    dinner: [
      { name: 'Grilled chicken + broccoli + rice', protein: 45, carbs: 55, fat: 8 },
      { name: 'Steak + sweet potato', protein: 50, carbs: 45, fat: 18 },
      { name: 'Salmon + asparagus + pasta', protein: 40, carbs: 50, fat: 15 },
      { name: 'Lean beef + veggies', protein: 45, carbs: 40, fat: 10 },
      { name: 'Pork tenderloin + quinoa', protein: 42, carbs: 45, fat: 12 },
      { name: 'Turkey meatballs + pasta', protein: 38, carbs: 50, fat: 10 },
    ],
    snack: [
      { name: 'Protein shake', protein: 25, carbs: 25, fat: 2 },
      { name: 'Greek yogurt', protein: 15, carbs: 10, fat: 3 },
      { name: 'Almonds', protein: 8, carbs: 8, fat: 14 },
      { name: 'Apple + peanut butter', protein: 8, carbs: 35, fat: 8 },
      { name: 'Cottage cheese', protein: 20, carbs: 5, fat: 4 },
      { name: 'String cheese + crackers', protein: 12, carbs: 20, fat: 8 },
    ],
  };

  // Mifflin-St Jeor formula
  const calculateTDEE = () => {
    const w = unit === 'imperial' ? weight : weight * 2.20462;
    const h = unit === 'imperial' ? height : height * 39.3701;
    const a = parseInt(age);

    let bmr;
    if (sex === 'male') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very: 1.725,
      extreme: 1.9,
    };

    const tdeeValue = bmr * activityMultipliers[activityLevel];
    return Math.round(tdeeValue);
  };

  // Calculate macros based on goal
  const calculateMacros = (tdeeValue) => {
    let proteinRatio, carbRatio, fatRatio;

    switch (goal) {
      case 'loss':
        proteinRatio = 0.4;
        carbRatio = 0.4;
        fatRatio = 0.2;
        break;
      case 'gain':
        proteinRatio = 0.25;
        carbRatio = 0.45;
        fatRatio = 0.3;
        break;
      case 'recomp':
        proteinRatio = 0.35;
        carbRatio = 0.4;
        fatRatio = 0.25;
        break;
      default: // maintenance
        proteinRatio = 0.3;
        carbRatio = 0.4;
        fatRatio = 0.3;
    }

    return {
      protein: Math.round((tdeeValue * proteinRatio) / 4),
      carbs: Math.round((tdeeValue * carbRatio) / 4),
      fat: Math.round((tdeeValue * fatRatio) / 9),
      calories: tdeeValue,
    };
  };

  // Generate 7-day meal plan
  const generateMealPlan = (targetMacros) => {
    const plan = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    for (let day of days) {
      const breakfast = mealDatabase.breakfast[Math.floor(Math.random() * mealDatabase.breakfast.length)];
      const lunch = mealDatabase.lunch[Math.floor(Math.random() * mealDatabase.lunch.length)];
      const dinner = mealDatabase.dinner[Math.floor(Math.random() * mealDatabase.dinner.length)];
      const snack = mealDatabase.snack[Math.floor(Math.random() * mealDatabase.snack.length)];

      const dayTotal = {
        protein: breakfast.protein + lunch.protein + dinner.protein + snack.protein,
        carbs: breakfast.carbs + lunch.carbs + dinner.carbs + snack.carbs,
        fat: breakfast.fat + lunch.fat + dinner.fat + snack.fat,
      };

      plan.push({
        day,
        meals: { breakfast, lunch, dinner, snack },
        totals: dayTotal,
      });
    }

    return plan;
  };

  // Generate grocery list from meal plan
  const generateGroceryList = (plan) => {
    const ingredients = {};

    const ingredientMap = {
      'Oatmeal with berries': ['Rolled oats', 'Blueberries', 'Strawberries'],
      'Eggs + toast': ['Eggs', 'Whole wheat bread'],
      'Greek yogurt + granola': ['Greek yogurt', 'Granola'],
      'Protein pancakes': ['Protein powder', 'Eggs', 'Banana'],
      'Smoothie bowl': ['Protein powder', 'Banana', 'Mixed berries', 'Almond milk'],
      'Cottage cheese + fruit': ['Cottage cheese', 'Peaches', 'Blueberries'],
      'Chicken breast + rice': ['Chicken breast', 'Brown rice'],
      'Turkey sandwich': ['Ground turkey', 'Whole wheat bread', 'Lettuce', 'Tomato'],
      'Tuna salad': ['Canned tuna', 'Mixed greens', 'Olive oil'],
      'Beef tacos': ['Ground beef', 'Taco shells', 'Cheddar cheese'],
      'Salmon + sweet potato': ['Salmon fillet', 'Sweet potato'],
      'Tofu stir-fry': ['Firm tofu', 'Mixed vegetables', 'Brown rice'],
      'Grilled chicken + broccoli + rice': ['Chicken breast', 'Broccoli', 'Brown rice'],
      'Steak + sweet potato': ['Ribeye steak', 'Sweet potato'],
      'Salmon + asparagus + pasta': ['Salmon fillet', 'Asparagus', 'Whole wheat pasta'],
      'Lean beef + veggies': ['Lean ground beef', 'Zucchini', 'Bell peppers'],
      'Pork tenderloin + quinoa': ['Pork tenderloin', 'Quinoa'],
      'Turkey meatballs + pasta': ['Ground turkey', 'Whole wheat pasta', 'Marinara sauce'],
      'Protein shake': ['Protein powder', 'Almond milk'],
      'Greek yogurt': ['Greek yogurt'],
      'Almonds': ['Almonds'],
      'Apple + peanut butter': ['Apples', 'Peanut butter'],
      'Cottage cheese': ['Cottage cheese'],
      'String cheese + crackers': ['String cheese', 'Whole grain crackers'],
    };

    for (let dayPlan of plan) {
      for (let mealType in dayPlan.meals) {
        const mealName = dayPlan.meals[mealType].name;
        if (ingredientMap[mealName]) {
          for (let ingredient of ingredientMap[mealName]) {
            ingredients[ingredient] = (ingredients[ingredient] || 0) + 1;
          }
        }
      }
    }

    return Object.entries(ingredients)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => `${name} (${count})`);
  };

  // Handle calculation
  const handleCalculate = () => {
    const calculatedTdee = calculateTDEE();
    const calculatedMacros = calculateMacros(calculatedTdee);
    const generatedPlan = generateMealPlan(calculatedMacros);
    const groceries = generateGroceryList(generatedPlan);

    setTdee(calculatedTdee);
    setMacros(calculatedMacros);
    setMealPlan(generatedPlan);
    setGroceryList(groceries);
  };

  // Handle share
  const handleShare = () => {
    if (!mealPlan || !macros) return;

    const shareData = {
      tdee,
      macros,
      mealPlan,
      user: { weight, height, age, sex, goal, activityLevel, unit },
    };

    const encoded = btoa(JSON.stringify(shareData));
    const baseUrl = window.location.origin + window.location.pathname;
    const url = `${baseUrl}?shared=${encoded}`;

    setShareUrl(url);
    navigator.clipboard.writeText(url);
  };

  // Handle swap meal
  const handleSwapMeal = (dayIndex, mealType) => {
    const newPlan = [...mealPlan];
    const options = mealDatabase[mealType];
    const randomMeal = options[Math.floor(Math.random() * options.length)];
    newPlan[dayIndex].meals[mealType] = randomMeal;

    // Recalculate day totals
    const dayMeals = newPlan[dayIndex].meals;
    newPlan[dayIndex].totals = {
      protein: dayMeals.breakfast.protein + dayMeals.lunch.protein + dayMeals.dinner.protein + dayMeals.snack.protein,
      carbs: dayMeals.breakfast.carbs + dayMeals.lunch.carbs + dayMeals.dinner.carbs + dayMeals.snack.carbs,
      fat: dayMeals.breakfast.fat + dayMeals.lunch.fat + dayMeals.dinner.fat + dayMeals.snack.fat,
    };

    setMealPlan(newPlan);
  };

  // Handle export CSV
  const handleExportCSV = () => {
    let csv = 'Grocery List Export\n\n';
    csv += groceryList.map(item => item).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grocery-list-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Macro Calculator</h1>
          <p className="text-slate-600 mt-2">Science-based meal planning & nutrition tracking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Your Profile</h2>

              {/* Unit Toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setUnit('imperial')}
                  className={`flex-1 py-2 px-3 rounded text-sm font-medium transition ${
                    unit === 'imperial'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  lbs/in
                </button>
                <button
                  onClick={() => setUnit('metric')}
                  className={`flex-1 py-2 px-3 rounded text-sm font-medium transition ${
                    unit === 'metric'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  kg/cm
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Weight ({unit === 'imperial' ? 'lbs' : 'kg'})
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Height ({unit === 'imperial' ? 'inches' : 'cm'})
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sex</label>
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Goal</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="loss">Fat Loss</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="gain">Muscle Gain</option>
                    <option value="recomp">Body Recomp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Activity Level</label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="sedentary">Sedentary (little exercise)</option>
                    <option value="light">Light (1-3 days/week)</option>
                    <option value="moderate">Moderate (3-5 days/week)</option>
                    <option value="very">Very Active (6-7 days/week)</option>
                    <option value="extreme">Extreme (2x per day)</option>
                  </select>
                </div>

                <button
                  onClick={handleCalculate}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition shadow-sm"
                >
                  Calculate Plan
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* TDEE & Macros */}
            {macros && (
              <>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-6">Your Numbers</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-slate-600">Daily Calorie Target</p>
                      <p className="text-3xl font-bold text-blue-600">{tdee}</p>
                      <p className="text-xs text-slate-500 mt-1">kcal/day</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-sm text-slate-600">Suggested Deficit/Surplus</p>
                      <p className="text-xl font-semibold text-slate-900">
                        {goal === 'loss' ? '-500 kcal' : goal === 'gain' ? '+500 kcal' : '±0 kcal'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">moderate pace</p>
                    </div>
                  </div>

                  {/* Macros */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Protein</span>
                        <span className="text-sm font-semibold text-slate-900">{macros.protein}g</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: '40%' }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">~40% of calories</p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Carbs</span>
                        <span className="text-sm font-semibold text-slate-900">{macros.carbs}g</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: '40%' }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">~40% of calories</p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Fat</span>
                        <span className="text-sm font-semibold text-slate-900">{macros.fat}g</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: '20%' }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">~20% of calories</p>
                    </div>
                  </div>
                </div>

                {/* Meal Plan */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">7-Day Meal Plan</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setMealPlan(generateMealPlan(macros))}
                        className="p-2 hover:bg-slate-100 rounded-lg transition"
                        title="Regenerate plan"
                      >
                        <RefreshCw className="w-5 h-5 text-slate-600" />
                      </button>
                      <button
                        onClick={handleShare}
                        className="p-2 hover:bg-slate-100 rounded-lg transition"
                        title="Share plan"
                      >
                        <Share2 className="w-5 h-5 text-slate-600" />
                      </button>
                    </div>
                  </div>

                  {shareUrl && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">✓ Link copied to clipboard!</p>
                      <p className="text-xs text-green-700 mt-1 break-all">{shareUrl}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {mealPlan.map((dayPlan, dayIndex) => (
                      <div key={dayIndex} className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-slate-900">{dayPlan.day}</h3>
                            <p className="text-sm text-slate-600">
                              {dayPlan.totals.protein}g P | {dayPlan.totals.carbs}g C | {dayPlan.totals.fat}g F
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => (
                            <div key={mealType} className="flex justify-between items-center text-slate-700 bg-slate-50 px-3 py-2 rounded">
                              <div>
                                <span className="capitalize font-medium text-slate-600">{mealType}: </span>
                                <span>{dayPlan.meals[mealType].name}</span>
                              </div>
                              <button
                                onClick={() => handleSwapMeal(dayIndex, mealType)}
                                className="p-1 hover:bg-slate-200 rounded transition"
                                title="Swap meal"
                              >
                                <RefreshCw className="w-4 h-4 text-slate-500" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grocery List */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">Grocery List</h2>
                    <button
                      onClick={handleExportCSV}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition"
                    >
                      <Download className="w-4 h-4" />
                      Export CSV
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {groceryList.map((item, idx) => (
                      <div key={idx} className="text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded">
                        ✓ {item}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {!macros && (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-slate-600 text-lg">Enter your details and click "Calculate Plan" to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlannerApp;
