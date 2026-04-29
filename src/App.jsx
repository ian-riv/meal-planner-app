import React, { useState, useEffect } from 'react';
import { Download, Share2, RefreshCw, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';

const MealPlannerApp = () => {
  // Form state
  const [weight, setWeight] = useState('170');
  const [goalWeight, setGoalWeight] = useState('160');
  const [height, setHeight] = useState('70');
  const [age, setAge] = useState('30');
  const [sex, setSex] = useState('male');
  const [goal, setGoal] = useState('loss');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [unit, setUnit] = useState('imperial');

  // Calculated state
  const [tdee, setTdee] = useState(null);
  const [macros, setMacros] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [groceryList, setGroceryList] = useState(null);
  const [shareUrl, setShareUrl] = useState('');
  const [expandedMacroSlider, setExpandedMacroSlider] = useState(false);

  // Macro slider state (as percentages)
  const [proteinPercent, setProteinPercent] = useState(40);
  const [carbsPercent, setCarbsPercent] = useState(40);
  const [fatPercent, setFatPercent] = useState(20);

  // Weekly check-in state
  const [weeklyWeights, setWeeklyWeights] = useState([]);
  const [currentWeekWeight, setCurrentWeekWeight] = useState('');
  const [calorieAdjustment, setCalorieAdjustment] = useState(0);

  // Meal database with detailed nutritional info and calorie-dense ingredient weights
  const mealDatabase = {
    breakfast: [
      {
        name: 'Oatmeal with berries', grams: 300, calories: 350, protein: 10, carbs: 45, fat: 3,
        ingredients: 'Oats (80g), Blueberries (100g), Strawberries (120g)'
      },
      {
        name: 'Eggs + toast', grams: 250, calories: 380, protein: 18, carbs: 30, fat: 12,
        ingredients: 'Eggs (100g), Whole wheat bread (50g)'
      },
      {
        name: 'Greek yogurt + granola', grams: 280, calories: 360, protein: 20, carbs: 35, fat: 5,
        ingredients: 'Greek yogurt (200g), Granola (80g)'
      },
      {
        name: 'Protein pancakes', grams: 250, calories: 380, protein: 25, carbs: 40, fat: 8,
        ingredients: 'Protein powder (30g), Eggs (50g), Banana (120g)'
      },
      {
        name: 'Smoothie bowl', grams: 350, calories: 400, protein: 15, carbs: 50, fat: 6,
        ingredients: 'Protein powder (30g), Banana (100g), Berries (120g), Almond milk (200ml)'
      },
      {
        name: 'Cottage cheese + fruit', grams: 220, calories: 320, protein: 22, carbs: 25, fat: 4,
        ingredients: 'Cottage cheese (150g), Peaches (70g)'
      },
    ],
    lunch: [
      {
        name: 'Chicken breast + rice', grams: 400, calories: 520, protein: 40, carbs: 50, fat: 5,
        ingredients: 'Chicken breast (200g), Brown rice (150g)'
      },
      {
        name: 'Turkey sandwich', grams: 380, calories: 480, protein: 30, carbs: 40, fat: 8,
        ingredients: 'Ground turkey (150g), Whole wheat bread (80g), Lettuce & tomato (150g)'
      },
      {
        name: 'Tuna salad', grams: 320, calories: 420, protein: 35, carbs: 15, fat: 10,
        ingredients: 'Canned tuna (150g), Mixed greens (100g), Olive oil (15g)'
      },
      {
        name: 'Beef tacos', grams: 350, calories: 550, protein: 35, carbs: 45, fat: 15,
        ingredients: 'Ground beef (150g), Taco shells (50g), Cheddar cheese (50g), Salsa (100g)'
      },
      {
        name: 'Salmon + sweet potato', grams: 420, calories: 580, protein: 35, carbs: 40, fat: 12,
        ingredients: 'Salmon fillet (180g), Sweet potato (180g), Olive oil (15g)'
      },
      {
        name: 'Tofu stir-fry', grams: 380, calories: 460, protein: 28, carbs: 45, fat: 8,
        ingredients: 'Firm tofu (200g), Mixed veggies (150g), Brown rice (100g)'
      },
    ],
    dinner: [
      {
        name: 'Grilled chicken + broccoli + rice', grams: 450, calories: 620, protein: 45, carbs: 55, fat: 8,
        ingredients: 'Chicken breast (200g), Brown rice (150g), Broccoli (150g), Olive oil (10g)'
      },
      {
        name: 'Steak + sweet potato', grams: 420, calories: 680, protein: 50, carbs: 45, fat: 18,
        ingredients: 'Ribeye steak (200g), Sweet potato (150g), Olive oil (15g)'
      },
      {
        name: 'Salmon + asparagus + pasta', grams: 430, calories: 650, protein: 40, carbs: 50, fat: 15,
        ingredients: 'Salmon fillet (180g), Pasta (100g), Asparagus (150g), Olive oil (15g)'
      },
      {
        name: 'Lean beef + veggies', grams: 400, calories: 580, protein: 45, carbs: 40, fat: 10,
        ingredients: 'Lean ground beef (150g), Zucchini (150g), Bell peppers (100g)'
      },
      {
        name: 'Pork tenderloin + quinoa', grams: 380, calories: 610, protein: 42, carbs: 45, fat: 12,
        ingredients: 'Pork tenderloin (180g), Quinoa (100g), Veggies (100g)'
      },
      {
        name: 'Turkey meatballs + pasta', grams: 420, calories: 600, protein: 38, carbs: 50, fat: 10,
        ingredients: 'Ground turkey (150g), Pasta (100g), Marinara sauce (100g)'
      },
    ],
    snack: [
      {
        name: 'Protein shake', grams: 300, calories: 280, protein: 25, carbs: 25, fat: 2,
        ingredients: 'Protein powder (30g), Almond milk (300ml)'
      },
      {
        name: 'Greek yogurt', grams: 200, calories: 240, protein: 15, carbs: 10, fat: 3,
        ingredients: 'Greek yogurt (200g)'
      },
      {
        name: 'Almonds', grams: 28, calories: 160, protein: 8, carbs: 8, fat: 14,
        ingredients: 'Almonds (28g)'
      },
      {
        name: 'Apple + peanut butter', grams: 180, calories: 280, protein: 8, carbs: 35, fat: 8,
        ingredients: 'Apple (150g), Peanut butter (30g)'
      },
      {
        name: 'Cottage cheese', grams: 150, calories: 220, protein: 20, carbs: 5, fat: 4,
        ingredients: 'Cottage cheese (150g)'
      },
      {
        name: 'String cheese + crackers', grams: 80, calories: 240, protein: 12, carbs: 20, fat: 8,
        ingredients: 'String cheese (28g), Whole grain crackers (50g)'
      },
    ],
  };

  // Load weigh-in history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('weeklyWeights');
    if (saved) {
      try {
        setWeeklyWeights(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading weigh-in history:', e);
      }
    }
  }, []);

  // Save weigh-in history to localStorage
  const saveWeighInHistory = (weights) => {
    setWeeklyWeights(weights);
    localStorage.setItem('weeklyWeights', JSON.stringify(weights));
  };

  // Load shared plan from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('shared');
    if (shared) {
      try {
        const data = JSON.parse(atob(shared));
        setWeight(String(data.user.weight));
        setGoalWeight(String(data.user.goalWeight));
        setHeight(String(data.user.height));
        setAge(String(data.user.age));
        setSex(data.user.sex);
        setGoal(data.user.goal);
        setActivityLevel(data.user.activityLevel);
        setUnit(data.user.unit);
        setProteinPercent(data.user.proteinPercent || 40);
        setCarbsPercent(data.user.carbsPercent || 40);
        setFatPercent(data.user.fatPercent || 20);
        setTdee(data.tdee);
        setMacros(data.macros);
        setMealPlan(data.mealPlan);
        setGroceryList(generateGroceryList(data.mealPlan));
      } catch (e) {
        console.error('Error loading shared plan:', e);
      }
    }
  }, []);

  // Mifflin-St Jeor formula with 15% conservative buffer
  const calculateTDEE = () => {
    const w = unit === 'imperial' ? parseFloat(weight) : parseFloat(weight) * 2.20462;
    const h = unit === 'imperial' ? parseFloat(height) : parseFloat(height) * 39.3701;
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
    // Apply 15% conservative buffer for realistic progress
    const conservativeTdee = tdeeValue * 0.85;
    return Math.round(conservativeTdee);
  };

  // Calculate macros based on slider percentages
  const calculateMacros = (tdeeValue) => {
    const proteinCalories = (tdeeValue * proteinPercent) / 100;
    const carbCalories = (tdeeValue * carbsPercent) / 100;
    const fatCalories = (tdeeValue * fatPercent) / 100;

    return {
      protein: Math.round(proteinCalories / 4),
      carbs: Math.round(carbCalories / 4),
      fat: Math.round(fatCalories / 9),
      calories: tdeeValue,
      percentages: {
        protein: proteinPercent,
        carbs: carbsPercent,
        fat: fatPercent,
      },
    };
  };

  // Calculate fat loss timeline
  const calculateFatLossTimeline = (tdeeValue) => {
    const currentW = unit === 'imperial' ? parseFloat(weight) : parseFloat(weight) * 2.20462;
    const goalW = unit === 'imperial' ? parseFloat(goalWeight) : parseFloat(goalWeight) * 2.20462;
    const weightToLose = currentW - goalW;

    // Typical deficit is 500 kcal/day = 1 lb/week loss
    const dailyDeficit = goal === 'loss' ? 500 : 0;
    const weeklyLossRate = dailyDeficit * 7 / 3500; // 1 lb = 3500 kcal
    const daysToGoal = weeklyLossRate > 0 ? Math.round((weightToLose / weeklyLossRate) * 7) : 0;

    return {
      weightToLose: Math.round(weightToLose * 10) / 10,
      weeklyLossRate: Math.round(weeklyLossRate * 10) / 10,
      daysToGoal,
      targetCalories: Math.round(tdeeValue - dailyDeficit),
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
      'Oatmeal with berries': { 'Rolled oats': 80, 'Blueberries': 100, 'Strawberries': 100 },
      'Eggs + toast': { 'Eggs': 100, 'Whole wheat bread': 50 },
      'Greek yogurt + granola': { 'Greek yogurt': 200, 'Granola': 50 },
      'Protein pancakes': { 'Protein powder': 30, 'Eggs': 50, 'Banana': 100 },
      'Smoothie bowl': { 'Protein powder': 30, 'Banana': 100, 'Mixed berries': 100, 'Almond milk': 200 },
      'Cottage cheese + fruit': { 'Cottage cheese': 150, 'Peaches': 80, 'Blueberries': 50 },
      'Chicken breast + rice': { 'Chicken breast': 200, 'Brown rice': 150 },
      'Turkey sandwich': { 'Ground turkey': 150, 'Whole wheat bread': 80, 'Lettuce': 50, 'Tomato': 100 },
      'Tuna salad': { 'Canned tuna': 150, 'Mixed greens': 100, 'Olive oil': 15 },
      'Beef tacos': { 'Ground beef': 150, 'Taco shells': 50, 'Cheddar cheese': 50 },
      'Salmon + sweet potato': { 'Salmon fillet': 180, 'Sweet potato': 150 },
      'Tofu stir-fry': { 'Firm tofu': 200, 'Mixed vegetables': 150, 'Brown rice': 100 },
      'Grilled chicken + broccoli + rice': { 'Chicken breast': 200, 'Broccoli': 150, 'Brown rice': 150 },
      'Steak + sweet potato': { 'Ribeye steak': 200, 'Sweet potato': 150 },
      'Salmon + asparagus + pasta': { 'Salmon fillet': 180, 'Asparagus': 150, 'Whole wheat pasta': 100 },
      'Lean beef + veggies': { 'Lean ground beef': 150, 'Zucchini': 150, 'Bell peppers': 100 },
      'Pork tenderloin + quinoa': { 'Pork tenderloin': 180, 'Quinoa': 100 },
      'Turkey meatballs + pasta': { 'Ground turkey': 150, 'Whole wheat pasta': 100, 'Marinara sauce': 100 },
      'Protein shake': { 'Protein powder': 30, 'Almond milk': 300 },
      'Greek yogurt': { 'Greek yogurt': 200 },
      'Almonds': { 'Almonds': 28 },
      'Apple + peanut butter': { 'Apples': 150, 'Peanut butter': 30 },
      'Cottage cheese': { 'Cottage cheese': 150 },
      'String cheese + crackers': { 'String cheese': 28, 'Whole grain crackers': 50 },
    };

    for (let dayPlan of plan) {
      for (let mealType in dayPlan.meals) {
        const mealName = dayPlan.meals[mealType].name;
        if (ingredientMap[mealName]) {
          for (let ingredient in ingredientMap[mealName]) {
            const amount = ingredientMap[mealName][ingredient];
            ingredients[ingredient] = (ingredients[ingredient] || 0) + amount;
          }
        }
      }
    }

    return Object.entries(ingredients)
      .sort((a, b) => b[1] - a[1])
      .map(([name, grams]) => `${name} (${Math.round(grams)}g)`);
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

  // Regenerate meal plan only
  const handleRegenerateMealPlan = () => {
    if (macros) {
      const generatedPlan = generateMealPlan(macros);
      const groceries = generateGroceryList(generatedPlan);
      setMealPlan(generatedPlan);
      setGroceryList(groceries);
    }
  };

  // Log weekly weigh-in and calculate adjustment
  const handleLogWeight = () => {
    if (!currentWeekWeight || !weight) return;

    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(currentWeekWeight),
    };

    const updated = [...weeklyWeights, newEntry];
    saveWeighInHistory(updated);

    // Analyze trend if 2+ weeks of data
    if (updated.length >= 2) {
      const recentWeights = updated.slice(-4); // Last 4 weigh-ins
      const firstWeight = recentWeights[0].weight;
      const lastWeight = recentWeights[recentWeights.length - 1].weight;
      const weeksOfData = recentWeights.length - 1;
      const actualLossPerWeek = (firstWeight - lastWeight) / weeksOfData;

      // Expected loss is 1 lb/week (or ~0.45 kg) for a -500 cal deficit
      const expectedLossPerWeek = goal === 'loss' ? 1 : 0;

      if (actualLossPerWeek < expectedLossPerWeek * 0.8 && actualLossPerWeek !== expectedLossPerWeek) {
        // Underperforming: suggest -250 cal reduction
        setCalorieAdjustment(-250);
      } else if (actualLossPerWeek > expectedLossPerWeek * 1.2 && actualLossPerWeek > 0) {
        // Overperforming: suggest +200 cal increase
        setCalorieAdjustment(200);
      } else {
        setCalorieAdjustment(0);
      }
    }

    setCurrentWeekWeight('');
  };

  // Get weight trend analysis
  const getWeightTrendAnalysis = () => {
    if (weeklyWeights.length < 2) return null;

    const recentWeights = weeklyWeights.slice(-4);
    const firstWeight = recentWeights[0].weight;
    const lastWeight = recentWeights[recentWeights.length - 1].weight;
    const weeksOfData = recentWeights.length - 1;
    const actualLossPerWeek = (firstWeight - lastWeight) / weeksOfData;
    const expectedLossPerWeek = goal === 'loss' ? 1 : 0;

    return {
      actualLossPerWeek: Math.round(actualLossPerWeek * 10) / 10,
      expectedLossPerWeek,
      weeksOfData,
      totalLoss: Math.round((firstWeight - lastWeight) * 10) / 10,
      onTrack: actualLossPerWeek >= expectedLossPerWeek * 0.8,
    };
  };

  // Handle share
  const handleShare = () => {
    if (!mealPlan || !macros) return;

    const shareData = {
      tdee,
      macros,
      mealPlan,
      user: { weight, goalWeight, height, age, sex, goal, activityLevel, unit, proteinPercent, carbsPercent, fatPercent },
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

  // Get fat loss timeline if applicable
  const fatLossTimeline = goal === 'loss' && tdee ? calculateFatLossTimeline(tdee) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
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
                    Current Weight ({unit === 'imperial' ? 'lbs' : 'kg'})
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
                    Goal Weight ({unit === 'imperial' ? 'lbs' : 'kg'})
                  </label>
                  <input
                    type="number"
                    value={goalWeight}
                    onChange={(e) => setGoalWeight(e.target.value)}
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

                {macros && (
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <button
                      onClick={() => setExpandedMacroSlider(!expandedMacroSlider)}
                      className="w-full flex items-center justify-between font-semibold text-slate-700 hover:text-slate-900"
                    >
                      <span>Adjust Macros</span>
                      {expandedMacroSlider ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>

                    {expandedMacroSlider && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-slate-700">Protein</label>
                            <span className="text-sm font-bold text-red-600">{proteinPercent}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={proteinPercent}
                            onChange={(e) => setProteinPercent(parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-slate-700">Carbs</label>
                            <span className="text-sm font-bold text-yellow-600">{carbsPercent}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={carbsPercent}
                            onChange={(e) => setCarbsPercent(parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-slate-700">Fat</label>
                            <span className="text-sm font-bold text-orange-600">{fatPercent}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={fatPercent}
                            onChange={(e) => setFatPercent(parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>

                        <p className="text-xs text-slate-600 text-center">
                          Total: {proteinPercent + carbsPercent + fatPercent}%
                        </p>

                        <button
                          onClick={handleCalculate}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
                        >
                          Apply Changes
                        </button>
                      </div>
                    )}
                  </div>
                )}

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

                  {/* Primary metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-slate-600">Daily Calorie Target</p>
                      <p className="text-3xl font-bold text-blue-600">{macros?.calories || tdee}</p>
                      <p className="text-xs text-slate-500 mt-1">kcal/day</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-sm text-slate-600">Deficit/Surplus</p>
                      <p className="text-xl font-semibold text-slate-900">
                        {goal === 'loss' ? '-500 kcal' : goal === 'gain' ? '+500 kcal' : '±0 kcal'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">per day</p>
                    </div>
                  </div>

                  {/* Fat loss timeline */}
                  {fatLossTimeline && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                      <h3 className="font-semibold text-orange-900 mb-3">Fat Loss Timeline</h3>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-orange-700 text-xs font-medium">To Lose</p>
                          <p className="text-xl font-bold text-orange-600">{fatLossTimeline.weightToLose} {unit === 'imperial' ? 'lbs' : 'kg'}</p>
                        </div>
                        <div>
                          <p className="text-orange-700 text-xs font-medium">Weekly Rate</p>
                          <p className="text-xl font-bold text-orange-600">{fatLossTimeline.weeklyLossRate} {unit === 'imperial' ? 'lbs' : 'kg'}</p>
                        </div>
                        <div>
                          <p className="text-orange-700 text-xs font-medium">Days to Goal</p>
                          <p className="text-xl font-bold text-orange-600">{Math.round(fatLossTimeline.daysToGoal / 7)}w</p>
                        </div>
                      </div>
                      <p className="text-xs text-orange-700 mt-3">
                        At ~{fatLossTimeline.weeklyLossRate} {unit === 'imperial' ? 'lbs' : 'kg'}/week, you'll reach your goal in approximately {Math.round(fatLossTimeline.daysToGoal / 30)} months.
                      </p>
                    </div>
                  )}

                  {/* Weekly Check-in */}
                  {macros && goal === 'loss' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h3 className="font-semibold text-blue-900 mb-3">Weekly Check-in</h3>

                      {getWeightTrendAnalysis() && (
                        <div className="mb-4 p-3 bg-white rounded border border-blue-100">
                          {(() => {
                            const analysis = getWeightTrendAnalysis();
                            return (
                              <>
                                <p className="text-xs font-medium text-blue-700 mb-2">
                                  Based on {analysis.weeksOfData} week{analysis.weeksOfData !== 1 ? 's' : ''} of data:
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <p className="text-blue-600 text-xs">Expected Loss</p>
                                    <p className="font-bold text-blue-900">{analysis.expectedLossPerWeek} {unit === 'imperial' ? 'lb' : 'kg'}/week</p>
                                  </div>
                                  <div>
                                    <p className="text-blue-600 text-xs">Actual Loss</p>
                                    <p className={`font-bold ${analysis.onTrack ? 'text-green-600' : 'text-orange-600'}`}>
                                      {analysis.actualLossPerWeek} {unit === 'imperial' ? 'lb' : 'kg'}/week
                                    </p>
                                  </div>
                                </div>
                                {!analysis.onTrack && calorieAdjustment < 0 && (
                                  <p className="text-xs text-orange-700 mt-2 bg-orange-50 p-2 rounded">
                                    💡 <strong>Not quite on track:</strong> Try reducing calories by <strong>{Math.abs(calorieAdjustment)}</strong> to {macros.calories + calorieAdjustment} kcal/day.
                                  </p>
                                )}
                                {analysis.onTrack && (
                                  <p className="text-xs text-green-700 mt-2 bg-green-50 p-2 rounded">
                                    ✓ <strong>On track!</strong> Keep it up with current targets.
                                  </p>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="0.1"
                          placeholder={`Enter this week's weight (${unit === 'imperial' ? 'lbs' : 'kg'})`}
                          value={currentWeekWeight}
                          onChange={(e) => setCurrentWeekWeight(e.target.value)}
                          className="flex-1 px-3 py-2 border border-blue-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={handleLogWeight}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-sm transition"
                        >
                          Log Weight
                        </button>
                      </div>

                      {weeklyWeights.length > 0 && (
                        <div className="mt-3 p-2 bg-white rounded border border-blue-100 text-xs">
                          <p className="text-blue-700 font-medium mb-2">Recent weigh-ins:</p>
                          <div className="space-y-1">
                            {weeklyWeights.slice(-4).map((entry, idx) => (
                              <p key={idx} className="text-blue-600">
                                {new Date(entry.date).toLocaleDateString()}: <strong>{entry.weight}</strong> {unit === 'imperial' ? 'lbs' : 'kg'}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Macros */}
                  <h3 className="font-semibold text-slate-900 mb-4">Daily Macro Targets</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Protein</span>
                        <span className="text-sm font-semibold text-slate-900">{macros.protein}g</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${macros.percentages.protein}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{macros.percentages.protein}% of calories</p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Carbs</span>
                        <span className="text-sm font-semibold text-slate-900">{macros.carbs}g</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${macros.percentages.carbs}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{macros.percentages.carbs}% of calories</p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Fat</span>
                        <span className="text-sm font-semibold text-slate-900">{macros.fat}g</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${macros.percentages.fat}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{macros.percentages.fat}% of calories</p>
                    </div>
                  </div>
                </div>

                {/* Meal Plan */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">7-Day Meal Plan</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={handleRegenerateMealPlan}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition text-sm"
                        title="Generate new meal plan"
                      >
                        <RefreshCw className="w-4 h-4" />
                        New Plan
                      </button>
                      <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg transition text-sm"
                        title="Share plan"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </div>

                  {shareUrl && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">✓ Link copied to clipboard!</p>
                      <p className="text-xs text-green-700 mt-1 break-all">{shareUrl}</p>
                    </div>
                  )}

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {mealPlan.map((dayPlan, dayIndex) => (
                      <div key={dayIndex} className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-slate-900">{dayPlan.day}</h3>
                            <p className="text-xs text-slate-500 mt-1">
                              {dayPlan.totals.protein}g P · {dayPlan.totals.carbs}g C · {dayPlan.totals.fat}g F
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => (
                            <div key={mealType} className="flex justify-between items-start text-slate-700 bg-slate-50 px-3 py-2 rounded text-xs">
                              <div className="flex-1">
                                <p className="capitalize font-medium text-slate-600 mb-1">{mealType}</p>
                                <p className="text-slate-800 font-medium">{dayPlan.meals[mealType].name}</p>
                                <p className="text-slate-500 mt-1 text-xs">
                                  {dayPlan.meals[mealType].ingredients}
                                </p>
                                <p className="text-slate-600 mt-1 font-medium">
                                  {dayPlan.meals[mealType].calories} kcal · {dayPlan.meals[mealType].protein}g P / {dayPlan.meals[mealType].carbs}g C / {dayPlan.meals[mealType].fat}g F
                                </p>
                              </div>
                              <button
                                onClick={() => handleSwapMeal(dayIndex, mealType)}
                                className="p-2 hover:bg-slate-200 rounded transition flex-shrink-0 ml-2 mt-2"
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
