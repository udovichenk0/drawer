// import { setCursorDiameter } from './../cursor/cursor.model';
// import Konva from "konva"
// import { reactive, ref } from "vue"
// export const drawFactory  = (canvas:any, stage:any, layer:any) => {
//   const DEFAULT_COLOR = '#000000'
//   const DEFAULT_SIZE = 10
//   const activeColor = ref(DEFAULT_COLOR)
//   const strokeWidth = ref(DEFAULT_SIZE)
//   const line = ref<Konva.Line>()
//   const isPaint = ref(false)
//   const outsidePosition = reactive({x: 0, y: 0})
//   const isOutside = ref(false)

//   const changeColor = (event: Event) => { //take color as prop
//     const target = event.target as HTMLInputElement
//     if(!event.target && !target.value) return
//     const color = target.value
//     activeColor.value = color
//   }

//   const changeStrokeWidth = (width: number) => {
//     strokeWidth.value = width
//     setCursorDiameter(width)
//   }

//   const startDraw = () => {
//     console.log(stage.value)
//     return 
//     const pos = stage.value?.getPointerPosition()
//     if(!pos) return
//     const { x, y } = pos
//     line.value = new Konva.Line({
//       points: [x, y, x, y],
//       stroke: activeColor.value,
//       strokeWidth: strokeWidth.value,
//       lineCap: 'round',
//       lineJoin: 'round',
//     });

//     isPaint.value = true
//     layer.value?.add(line.value)
//     canvas.value!.addEventListener('mousemove', draw)
//   }

//   const drawLine = (x: number, y: number) => {
//     if(!line.value) return
//     const pointers = line.value.points().concat([x,y])
//     line.value.points(pointers)
//   }
//   const draw = (e: any) => {
//     const pos = stage.value?.getPointerPosition()
//     const calculateOutsidePosition = () => {
//       const width = canvas.value!.getBoundingClientRect().width - 500
//       const height = canvas.value!.getBoundingClientRect().height - 500
//       const xPosition = e.offsetX - (width/2)
//       const yPosition = e.offsetY - (height/2)
//       return {
//         xPosition,
//         yPosition
//       }
//     }
//     const { xPosition, yPosition } = calculateOutsidePosition()
//     if(!pos || !line.value) return
//     stage.value?.on('mouseleave', () => isOutside.value = true)
//     stage.value?.on('mouseenter', () => isOutside.value = false)

//     if(isOutside.value){
//       outsidePosition.x = xPosition
//       outsidePosition.y = yPosition
//     }

//     if(isOutside.value && isPaint.value) {
//       const x = roundCoordinate(pos.x)
//       const y = roundCoordinate(pos.y)
//       drawLine(x, y)
//       isPaint.value = false
//     }

//     if(!isOutside.value && !isPaint.value){
//       isPaint.value = true
//       const x = roundCoordinate(outsidePosition.x)
//       const y = roundCoordinate(outsidePosition.y)
//       line.value = new Konva.Line({
//         points: [x,y],
//         stroke: activeColor.value,
//         strokeWidth: strokeWidth.value,
//         lineCap: 'round',
//         lineJoin: 'round',
//       });
//       layer.value?.add(line.value)
//       restoreOutsidePosition()
//     }
//     if(!isPaint.value) return
//     drawLine(pos.x, pos.y)
//   }

//   const stopDraw = () => {
//     isPaint.value = false
//     restoreOutsidePosition()
//     canvas.value?.removeEventListener('mousemove', draw)
//   }
//   // utils

//   const roundCoordinate = (crd: number) => {
//     //temporarly make it hardcoded(500 is width of canvas)
//     if(crd >= 0 && crd <= 500) return crd
//     else if(crd > 500) return 500 
//     return 0
//   }
//   const restoreOutsidePosition = () => {
//     outsidePosition.x = 0
//     outsidePosition.y = 0
//   }
//   return {
//     changeColor,
//     changeStrokeWidth,
//     startDraw,
//     stopDraw,
//     strokeWidth,
//     activeColor
//   }
// }
