import Peer from "peerjs";

export default class Web{
    myPeer
    myStream
    peers = {}
    onCalledPeers = {}

    videoGrid = document.querySelector('.video-grid')

    constructor(userId) {
        this.myPeer = new Peer(userId)
        this.initialize()
    }

    initialize(){
        this.myPeer.on('call',(call) => {
            call.answer(this.myStream)
            const video = document.createElement('video')
            this.onCalledPeers[call.peer] = {call, video}

            call.on('stream',(userVideoStream) => {
                this.addVideoStream(video, userVideoStream)
            })
        })
    }



    addVideoStream(video,stream){
        video.srcObject = stream
        video.addEventListener('loadedmetadata',()=>{
            video.play()
        })
        if(this.videoGrid) this.videoGrid.append(video)
    }
}