/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useRef } from 'react'
import { ContainerScene } from './Scene.elements'
import { cleanUpScene, initScene, setFloatPointsElements } from './Script'
import { FloatPaintLabel, FloatPaintText, FloatPoint } from './Styles'
const Scene = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    initScene(mountRef)
    setFloatPointsElements('.float-point-0')
    return () => {
      cleanUpScene()
    }
  }, [])

  return (
    <>
      <ContainerScene
        className="SceneContainer"
        ref={mountRef}
      ></ContainerScene>
      <FloatPoint className="float-point float-point-0">
        <FloatPaintLabel className="float-point-label">1</FloatPaintLabel>
        <FloatPaintText className="float-point-text">
          loream ipsum
        </FloatPaintText>
      </FloatPoint>
    </>
  )
}

export default Scene
