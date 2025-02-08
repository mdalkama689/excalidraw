import RoomCanVas from "@/components/RoomCanvas";

export default  async function Room({params}: {
params: {
  roomId: string
}
}){

  const roomId = ( await params).roomId
  return (
    <RoomCanVas roomId={roomId} />
  )
}