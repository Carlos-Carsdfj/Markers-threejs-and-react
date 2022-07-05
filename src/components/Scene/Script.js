import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as dat from 'dat.gui'
// Global variables
let currentRef = null
let floatPoints = []
const gui = new dat.GUI({ width: 600 })
// Scene, camera, renderer
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x8536b)
const camera = new THREE.PerspectiveCamera(25, 100 / 100, 0.1, 250)
scene.add(camera)
camera.position.set(-37, 27, 45)
camera.lookAt(new THREE.Vector3())

const renderer = new THREE.WebGLRenderer()
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.physicallyCorrectLights = true

renderer.toneMapping = THREE.CineonToneMapping

// cantidad de luz que el toneMapping permita en escena
renderer.toneMappingExposure = 1.5

renderer.setSize(100, 100)

// OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement)

orbitControls.enableDamping = true

// Resize canvas
const resize = () => {
  renderer.setSize(currentRef.clientWidth, currentRef.clientHeight)
  camera.aspect = currentRef.clientWidth / currentRef.clientHeight
  camera.updateProjectionMatrix()
}
window.addEventListener('resize', resize)

// Animate the scene
const animate = () => {
  for (const floatPoint of floatPoints) {
    const screenPosition = floatPoint.position.clone()
    screenPosition.project(camera)
    const positionX = screenPosition.x * currentRef.clientWidth * 0.5
    const positionY = screenPosition.y * -currentRef.clientHeight * 0.5
    floatPoint.element.style.transform = `translate(${positionX}px, ${positionY}px)`
  }
  orbitControls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()

// Loaders
const loader = new GLTFLoader()
loader.load('./models/Mapa.glb', (gltf) => {
  scene.add(gltf.scene)
})
// Lights

const light1 = new THREE.DirectionalLight(0xffffff, 7.7899)
light1.position.set(0, 12, 5)
light1.castShadow = true
light1.shadow.mapSize.set(1024, 1024)

const al = new THREE.AmbientLight(0xffffff, 0.61)
scene.add(al)
// si la sombra en el objeto castiado se refleja con algunos errores
light1.shadow.bias = 0.0005
light1.shadow.normalBias = 0.0005
scene.add(light1)

const enviromentMap = new THREE.CubeTextureLoader()
const envMap = enviromentMap.load([
  '/envmap/px.png',
  '/envmap/nx.png',
  '/envmap/py.png',
  '/envmap/ny.png',
  '/envmap/pz.png',
  '/envmap/nz.png',
])

scene.environment = envMap

// Init and mount the scene
export const initScene = (mountRef) => {
  currentRef = mountRef.current
  resize()
  currentRef.appendChild(renderer.domElement)
}

// Dismount and clena up the buffer from the scene
export const cleanUpScene = () => {
  gui.destroy()
  scene.removeFromParent()
  currentRef.removeChild(renderer.domElement)
}

export const setFloatPointsElements = (floatPoint) => {
  const pointElement = {
    position: new THREE.Vector3(-14.39455, 7.2231, 8.43789),
    element: document.querySelector(floatPoint),
  }
  floatPoints.push(pointElement)

  // Esto no soporta react 18 usar cambiando el React-dom/client por React-dom de react17
  /* const fold = gui.addFolder(floatPoint)
  fold
    .add(pointElement.position, 'x')
    .min(-10)
    .max(20)
    .step(0.00001)
    .name('Pos X')
  fold
    .add(pointElement.position, 'y')
    .min(-10)
    .max(20)
    .step(0.00001)
    .name('Pos Y')
  fold
    .add(pointElement.position, 'z')
    .min(-10)
    .max(20)
    .step(0.00001)
    .name('Pos Z')*/
}
