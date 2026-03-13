import * as THREE from 'three'
import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'

// Your custom words - add or remove as many as you want!
const CUSTOM_WORDS = [
  "Salt", "Sugar", "Flour", "Rice", "Wheat", "Milk", "Butter", "Cheese", "Eggs", "Yogurt", "Garlic", "Onion", "Tomato", "Potato", "Carrot", "Cabbage", "Spinach", "Broccoli", "Cucumber", "Green Chili", "Ginger", "Turmeric", "Cumin", "Coriander", "Black Pepper", "Mustard Seeds", "Fenugreek", "Cardamom", "Cloves", "Cinnamon", "Bay Leaf", "Paprika", "Chili Powder", "Soy Sauce", "Vinegar", "Olive Oil", "Sunflower Oil", "Ghee", "Honey", "Lemon", "Lime", "Apple", "Banana", "Mango", "Pineapple", "Strawberry", "Almonds", "Cashews", "Peanuts", "Raisins", "Oats", "Barley", "Corn", "Semolina", "Paneer", "Cream", "Buttermilk", "Tofu", "Mushroom", "Capsicum", "Eggplant", "Pumpkin", "Sweet Potato", "Radish", "Beetroot", "Cauliflower", "Green Peas", "Chickpeas", "Lentils", "Kidney Beans", "Black Beans", "Soybeans", "Sesame Seeds", "Poppy Seeds", "Saffron", "Nutmeg", "Star Anise", "Fennel Seeds", "Curry Leaves", "Mint", "Basil", "Parsley", "Rosemary", "Thyme", "Ketchup", "Mayonnaise", "Mustard Sauce", "Fish Sauce", "Oyster Sauce", "Brown Sugar", "Maple Syrup", "Coconut Milk", "Coconut Oil", "Desiccated Coconut", "Dates", "Walnuts", "Pistachios", "Hazelnuts", "Chia Seeds", "Flax Seeds", "Quinoa", "Millet", "Buckwheat", "Sorghum", "Amaranth", "Rye", "Whole Wheat Flour", "Corn Flour", "Rice Flour", "Gram Flour", "Tapioca", "Arrowroot", "Custard Powder", "Baking Soda", "Baking Powder", "Yeast", "Vanilla Extract", "Chocolate", "Cocoa Powder", "Dark Chocolate", "White Chocolate", "Caramel", "Molasses", "Jaggery", "Palm Sugar", "Rock Sugar", "Icing Sugar", "Condensed Milk", "Evaporated Milk", "Whipping Cream", "Ice Cream", "Gelatin", "Agar Agar", "Tamarind", "Tamarind Paste", "Green Apple", "Red Apple", "Pear", "Peach", "Plum", "Apricot", "Cherry", "Blueberry", "Raspberry", "Blackberry", "Dragon Fruit", "Kiwi", "Papaya", "Guava", "Lychee", "Jackfruit", "Passion Fruit", "Coconut", "Pomegranate", "Watermelon", "Muskmelon", "Cantaloupe", "Avocado", "Zucchini", "Okra", "Bitter Gourd", "Bottle Gourd", "Ridge Gourd", "Snake Gourd", "Taro Root", "Turnip", "Leek", "Spring Onion", "Shallot", "Celery", "Asparagus", "Artichoke", "Red Cabbage", "Kale", "Lettuce", "Arugula", "Collard Greens", "Mustard Greens", "Swiss Chard", "Bok Choy", "Watercress", "Bean Sprouts", "Lotus Root", "Bamboo Shoots", "Edamame", "Green Beans", "Snow Peas", "Sugar Snap Peas", "Black Eyed Peas", "Pinto Beans", "Cannellini Beans", "Lima Beans", "Fava Beans", "Adzuki Beans", "Mung Beans", "Urad Dal", "Toor Dal", "Masoor Dal", "Moong Dal", "Chana Dal", "Kala Chana", "White Chickpeas", "Red Lentils", "Yellow Lentils", "Split Peas", "Dry Peas", "Hemp Seeds", "Pumpkin Seeds", "Sunflower Seeds", "Water Chestnut", "Chestnut", "Macadamia Nuts", "Pine Nuts", "Brazil Nuts", "Tiger Nuts", "Candlenuts", "Horseradish", "Wasabi", "Pickles", "Relish", "Hot Sauce", "Barbecue Sauce", "Teriyaki Sauce", "Hoisin Sauce", "Sweet Chili Sauce", "Sriracha", "Tahini", "Hummus", "Pesto", "Salsa", "Guacamole", "Chutney", "Mint Chutney", "Tamarind Chutney", "Coconut Chutney", "Green Chutney", "Red Chili Paste", "Garlic Paste", "Ginger Paste", "Onion Powder", "Garlic Powder", "Curry Powder", "Garam Masala", "Chaat Masala", "Kitchen King Masala", "Tandoori Masala", "Pav Bhaji Masala", "Sambar Powder", "Rasam Powder", "Pickled Ginger", "Fermented Soybeans", "Miso Paste", "Seaweed", "Nori", "Kombu", "Wakame", "Rice Noodles", "Egg Noodles", "Udon Noodles", "Soba Noodles", "Spaghetti", "Penne", "Fusilli", "Macaroni", "Lasagna Sheets", "Vermicelli", "Instant Noodles", "Bread", "White Bread", "Whole Wheat Bread", "Sourdough Bread", "Baguette", "Croissant", "Bagel", "Tortilla", "Pita Bread", "Naan", "Paratha", "Roti", "Kulcha", "Dosa Batter", "Idli Batter", "Rice Paper", "Spring Roll Wrapper", "Phyllo Dough", "Shortcrust Pastry", "Puff Pastry", "Pizza Dough", "Burger Bun", "Hot Dog Bun", "Cornmeal", "Polenta", "Grits", "Cream Cheese", "Ricotta Cheese", "Mozzarella Cheese", "Parmesan Cheese", "Cheddar Cheese", "Feta Cheese", "Blue Cheese", "Goat Cheese", "Brie Cheese", "Camembert Cheese", "Yogurt Drink", "Kefir", "Buttermilk Powder", "Milk Powder", "Chocolate Syrup", "Strawberry Syrup", "Caramel Syrup", "Rose Syrup", "Orange Marmalade", "Jam", "Strawberry Jam", "Apricot Jam", "Peach Jam", "Blueberry Jam", "Honey Mustard", "Apple Cider Vinegar", "Balsamic Vinegar", "Rice Vinegar", "White Vinegar", "Red Wine Vinegar", "Sesame Oil", "Peanut Oil", "Canola Oil", "Vegetable Oil", "Mustard Oil", "Palm Oil", "Avocado Oil", "Truffle Oil"
]

function Word({ children, ...props }) {
  const color = new THREE.Color()
  const fontProps = { font: '/Inter-Bold.woff', fontSize: 1.5, letterSpacing: -0.05, lineHeight: 1, 'material-toneMapped': false }
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  const over = (e) => (e.stopPropagation(), setHovered(true))
  const out = () => setHovered(false)
  
  useEffect(() => {
    if (hovered) document.body.style.cursor = 'pointer'
    return () => (document.body.style.cursor = 'auto')
  }, [hovered])

  useFrame(() => {
    if (ref.current) {
      ref.current.material.color.lerp(color.set(hovered ? '#fa2720' : 'white'), 0.1)
    }
  })

  return (
    <Billboard {...props}>
      <Text ref={ref} onPointerOver={over} onPointerOut={out} onClick={() => console.log('clicked')} {...fontProps} children={children} />
    </Billboard>
  )
}

function Cloud({ count = 4, radius = 20 }) {
  const words = useMemo(() => {
    const temp = []
    const spherical = new THREE.Spherical()
    const phiSpan = Math.PI / (count + 1)
    const thetaSpan = (Math.PI * 2) / count
    let wordIndex = 0
    for (let i = 1; i < count + 1; i++) {
      for (let j = 0; j < count; j++) {
        // Get word from custom list, loop back to start if we run out
        const word = CUSTOM_WORDS[wordIndex % CUSTOM_WORDS.length]
        temp.push([new THREE.Vector3().setFromSpherical(spherical.set(radius, phiSpan * i, thetaSpan * j)), word])
        wordIndex++
      }
    }
    return temp
  }, [count, radius])

  return words.map(([pos, word], index) => <Word key={index} position={pos} children={word} />)
}

function RotatingGroup({ children }) {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })
  
  return <group ref={groupRef}>{children}</group>
}

export default function WordCloud3D() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 35], fov: 90 }}>
        <fog attach="fog" args={['#0a0a15', 0, 60]} />
        <color attach="background" args={['#0a0a15']} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#4a90d9" />
        <pointLight position={[0, 20, 0]} intensity={0.6} color="#ff6b6b" />
        <RotatingGroup rotation={[10, 10.5, 10]}>
          <Cloud count={6} radius={18} />
        </RotatingGroup>
      </Canvas>
    </div>
  )
}

