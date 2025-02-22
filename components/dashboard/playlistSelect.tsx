import { Button } from "@/components/ui/button"
import { getPlaylists } from "@/lib/client/getPlaylists"
import { useStore } from "@/lib/state"
import { FolderPlus, Loader2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useToast } from "../ui/toast/useToast"
import Creating from "./creating"

export const PlaylistSelect = () => {
  const accessToken = useStore((state) => state.accessToken)
  const userData = useStore((state) => state.userData)
  const playlists = useStore((state) => state.playlists)
  const setPlaylists = useStore((state) => state.setPlaylists)
  const selected = useStore((state) => state.selected)
  const setSelected = useStore((state) => state.setSelected)

  useEffect(() => {
    if (accessToken) {
      getPlaylists({ accessToken }).then((res) => {
        if (res.length === 0) setPlaylists({})
        else setPlaylists(res.playlists)
      })
    }
  }, [accessToken])

  const router = useRouter()
  const [selecting, setSelecting] = useState(true)

  const [roomId, setRoomId] = useState<string | null>(null)

  const createRoom = async (id: string, user?: string) => {
    if (user) {
      const res = await fetch(`/api/createRoom?playlist=${id}&user=${user}`, {
        method: "POST",
      })
      const data = await res.json()
      setRoomId(data.roomId)
    }
  }

  const selectHandler = (id: string) => {
    setSelected(id)
    setSelecting(false)

    createRoom(id, userData?.id)
  }

  useEffect(() => {
    if (roomId) {
      router.push(`/editor/${roomId}`)
    }
  }, [roomId])

  const { toast } = useToast()

  return (
    <div className="flex h-full min-w-[650px] flex-grow flex-col  items-start justify-start overflow-y-auto p-12">
      <div className="flex w-full items-center justify-between">
        <div className="text-3xl font-medium">Select A Playlist</div>
        <Button
          onClick={() => {
            toast({
              title: "Coming soon!",
              description: "Feel free to contribute on GitHub 😁",
            })
          }}
          disabled={!selecting}
          className="text-base">
          <FolderPlus className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </div>
      {/* <div className="my-4 w-[900px] text-xs">{accessToken}</div> */}
      <div className=" mt-8 flex w-full max-w-screen-lg flex-wrap gap-4">
        {/* <div className="h-96 w-[900px] overflow-auto whitespace-pre text-xs">
          {JSON.stringify(playlists, null, "\t")}
        </div> */}
        {selecting ? (
          playlists ? (
            playlists?.items?.map((playlist: any, i: number) => {
              if (userData?.id !== playlist.owner.id || !playlist.public)
                return null
              return (
                <Button
                  key={i}
                  className="h-auto w-52 flex-col items-start justify-start rounded-lg p-3 text-base"
                  variant="subtle"
                  onClick={() => selectHandler(playlist.id)}>
                  <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-md">
                    <Image
                      src={playlist.images[0].url}
                      alt="playlist image"
                      fill
                      sizes="250px"
                      className="min-h-full min-w-full object-cover"
                    />
                  </div>
                  <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-left">
                    {playlist.name}
                  </div>
                  <div className="ellipsis mt-1 h-5 w-full overflow-hidden whitespace-nowrap text-left text-sm font-normal text-zinc-500">
                    {playlist.description ?? ""}
                  </div>
                </Button>
              )
            })
          ) : (
            <div className="text-zinc-500">
              No Playlists Found. Create one to get started!
            </div>
          )
        ) : (
          <Creating
            name={
              playlists?.items.find((item: any) => item.id === selected)?.name
            }
          />
        )}
      </div>
    </div>
  )
}

const LiveblocksLogo = () => (
  <svg
    width="85"
    height="16"
    viewBox="0 0 128 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M28.8316 3.21884H26L26.0007 19.9974H28.8316V3.21884ZM34.0855 8.01549H31.2547V19.9974H34.0855V8.01549ZM34.0855 3.08984H31.2547V6.14356H34.0855V3.08984ZM38.2401 8.01549H35.1978L39.4807 19.9974H42.6398L46.9226 8.01549H43.9269L42.1367 13.6908C42.0901 13.8384 41.9224 14.416 41.6336 15.4222L41.0602 17.3529C40.7213 16.1277 40.3665 14.9069 39.996 13.6908L38.2401 8.01549ZM58.5185 11.7601C58.2841 10.9567 57.9408 10.2737 57.4879 9.71184C56.9805 9.08118 56.3376 8.59313 55.5579 8.24984C54.7853 7.89868 53.9274 7.72381 52.9836 7.72381C51.1897 7.72381 49.7542 8.28496 48.6778 9.40798C48.1408 9.9882 47.7303 10.6737 47.4723 11.4211C47.2072 12.1929 47.0746 13.0472 47.0746 13.9832C47.0746 15.9877 47.6092 17.5364 48.6785 18.6286C49.7621 19.7359 51.2055 20.2898 53.0072 20.2898C54.5517 20.2898 55.803 19.943 56.7633 19.2485C57.723 18.5541 58.3586 17.5249 58.6704 16.1597L55.909 15.949C55.7765 16.69 55.4719 17.244 54.996 17.6102C54.5201 17.9693 53.8493 18.1492 52.9836 18.1492C51.0027 18.1492 49.9886 17.0333 49.942 14.8023H58.8575L58.8696 14.4046C58.8696 13.445 58.7521 12.5635 58.5185 11.7601ZM50.5734 10.918C51.0729 10.2157 51.8763 9.86449 52.9836 9.86449C53.5218 9.86449 53.9747 9.93831 54.341 10.0867C54.7079 10.235 55.024 10.4729 55.2891 10.8005C55.4953 11.0547 55.6539 11.3441 55.7571 11.6547C55.8734 11.9788 55.9443 12.3174 55.9678 12.6609H49.9649C50.0352 11.9665 50.238 11.3853 50.5734 10.918ZM69.8685 8.48419C69.0651 7.96103 68.137 7.70016 67.0842 7.70016H67.0827C66.3188 7.70016 65.6207 7.85568 64.9886 8.16814C64.3667 8.4713 63.8342 8.9309 63.4435 9.50186V3.21884H60.6126V19.9974H63.4442V18.3477C63.8031 18.9405 64.3115 19.4286 64.9184 19.7631C65.5505 20.1143 66.2485 20.2898 67.0125 20.2898C68.0739 20.2898 69.0135 20.0361 69.8341 19.5295C70.6525 19.0228 71.2882 18.2968 71.7404 17.3529C72.2005 16.4012 72.4313 15.2861 72.4313 14.0068C72.4313 12.7584 72.2041 11.659 71.7526 10.7073C71.3076 9.74768 70.6797 9.00664 69.8685 8.48419ZM68.663 17.1774C68.2108 17.8639 67.4389 18.2065 66.346 18.2065C65.3627 18.2065 64.6224 17.8517 64.1236 17.1422C63.6241 16.4327 63.3747 15.395 63.3747 14.0298C63.3747 12.7111 63.5968 11.682 64.0412 10.9409C64.4941 10.192 65.2545 9.81791 66.3231 9.81791C67.4153 9.81791 68.1914 10.1612 68.6516 10.847C69.1124 11.5257 69.3417 12.5792 69.3417 14.0068C69.3417 15.4337 69.116 16.4908 68.663 17.1774ZM77.0302 3.21884H74.1986V19.9974H77.0302V3.21884ZM81.6169 19.5409C82.5379 20.0404 83.6294 20.2898 84.8936 20.2898C86.1105 20.2898 87.1791 20.0283 88.0993 19.5065C89.0131 18.9985 89.7576 18.2335 90.2407 17.3064C90.7474 16.3546 91.0011 15.2545 91.0011 14.0068C91.0011 12.8057 90.7517 11.7285 90.2522 10.7775C89.7734 9.83933 89.0341 9.05921 88.1229 8.53078C87.202 7.99256 86.1256 7.72309 84.8936 7.72309C83.653 7.72309 82.5687 7.99256 81.6406 8.53078C80.7318 9.05692 79.9926 9.83235 79.5106 10.7653C79.0197 11.7092 78.7739 12.7899 78.7739 14.0068C78.7739 15.3018 79.0154 16.4206 79.4992 17.3644C79.9697 18.2867 80.7079 19.0453 81.6169 19.5409ZM87.245 17.1895C86.7691 17.8603 85.9851 18.1957 84.8936 18.1957C84.1525 18.1957 83.5556 18.0474 83.1033 17.7507C82.6504 17.4468 82.3229 16.9903 82.12 16.3819C81.9172 15.7655 81.8162 14.9736 81.8162 14.0061C81.8162 12.5556 82.0541 11.4949 82.53 10.8241C83.0137 10.1533 83.8014 9.81791 84.8936 9.81791C85.9779 9.81791 86.7577 10.1533 87.2335 10.8241C87.7173 11.4949 87.9588 12.5556 87.9588 14.0068C87.9588 15.4574 87.7209 16.518 87.245 17.1895ZM94.8626 19.5409C95.7756 20.0404 96.8635 20.2898 98.1277 20.2898C99.1103 20.2898 99.9882 20.1186 100.76 19.7753C101.533 19.432 102.16 18.9525 102.644 18.3362C103.129 17.708 103.447 16.967 103.568 16.1826L100.842 15.9024C100.655 16.6506 100.343 17.2089 99.9058 17.5751C99.4693 17.942 98.8759 18.1255 98.1277 18.1255C97.363 18.1255 96.7625 17.9693 96.3253 17.6568C95.8888 17.3372 95.5842 16.8814 95.413 16.288C95.241 15.6874 95.1557 14.927 95.1557 14.0068C95.1557 13.1017 95.241 12.3528 95.413 11.7601C95.5842 11.1595 95.8845 10.6994 96.3138 10.3791C96.751 10.0515 97.3552 9.88814 98.1277 9.88814C98.9541 9.88814 99.5668 10.1182 99.9646 10.5783C100.37 11.0305 100.659 11.6504 100.83 12.4388L103.51 11.9586C103.253 10.6793 102.671 9.65379 101.766 8.88194C100.869 8.10938 99.6564 7.72381 98.1277 7.72381C96.8793 7.72381 95.7992 7.98898 94.8862 8.51931C93.9847 9.03823 93.2562 9.81153 92.7921 10.7424C92.3083 11.6863 92.0661 12.7742 92.0661 14.0068C92.0661 15.309 92.304 16.4327 92.7799 17.3766C93.2637 18.3204 93.9581 19.0421 94.8626 19.5409ZM107.91 15.5512L109.232 14.287L112.742 19.9974H116.007L111.151 12.4732L115.855 8.01549H112.18L107.91 12.3922V3.21884H105.078V19.9974H107.91V15.5512ZM118.488 19.8569C119.284 20.1457 120.169 20.2897 121.144 20.2897C122.634 20.2897 123.862 19.993 124.83 19.4011C125.805 18.8077 126.293 17.8402 126.293 16.4986C126.293 15.6249 126.066 14.9384 125.614 14.4396C125.162 13.9322 124.623 13.5695 123.999 13.351C123.383 13.1252 122.544 12.8952 121.484 12.6608C120.867 12.5282 120.38 12.4035 120.021 12.2867C119.662 12.1692 119.373 12.0172 119.155 11.8302C118.945 11.6424 118.839 11.4009 118.839 11.1049C118.839 10.6678 119.034 10.3367 119.424 10.1102C119.814 9.88373 120.298 9.77049 120.875 9.77049C121.639 9.77049 122.236 9.95396 122.666 10.3209C123.102 10.6878 123.336 11.2375 123.367 11.9707L125.988 11.5378C125.863 10.1962 125.337 9.22511 124.408 8.62383C123.488 8.02398 122.31 7.72298 120.875 7.72298C120.032 7.72298 119.253 7.85126 118.535 8.10926C117.825 8.35866 117.252 8.75283 116.815 9.29176C116.378 9.82926 116.16 10.5079 116.16 11.3271C116.16 12.0839 116.347 12.6959 116.721 13.1639C117.102 13.6369 117.592 14.0102 118.149 14.2518C118.726 14.5019 119.451 14.7399 120.325 14.9656L121.051 15.1412C121.535 15.256 122.015 15.3887 122.49 15.5389C122.817 15.6407 123.086 15.7812 123.297 15.9603C123.508 16.1395 123.613 16.3739 123.613 16.6627C123.613 17.1694 123.402 17.5599 122.981 17.8323C122.568 18.106 121.963 18.2422 121.168 18.2422C120.356 18.2422 119.709 18.0394 119.225 17.6338C118.742 17.2281 118.496 16.6433 118.488 15.8786L115.821 16.1825C115.851 17.1034 116.105 17.8717 116.581 18.488C117.065 19.1044 117.7 19.5602 118.488 19.8569Z"
      fill="currentColor"></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.5 9H0L4 13V18.5L13.5 9Z"
      fill="currentColor"></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.5 20H20L16 16V10.5L6.5 20Z"
      fill="currentColor"></path>
  </svg>
)
