var playing = false;
var gi = 0;
var audioChunks = [[], [], [], [], []];

const recordAudio = () =>
  new Promise(async resolve => {
    var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    var mediaRecorder = new MediaRecorder(stream);
    var i = 0;

    mediaRecorder.addEventListener("dataavailable", event => {
      console.log("dataavailable" + i)
      audioChunks[i].push(event.data);
    });

    var start = () => {
      //audioChunks =  [[], []];
      i = (i+1)%5;
      audioChunks[i] = [];
      if (mediaRecorder.state != "recording"){
        mediaRecorder.start(100);
        playing = true;
      }
    }

    const start_play = () => {

    }

    var stop = () =>
      new Promise(resolve => {
        //mediaRecorder.addEventListener("stop", () => {});
        console.log("create audio blob S" + (i) + ":=(" + audioChunks[0].length + ":" + audioChunks[1].length + ":" + audioChunks[2].length + ")" );
        var audioBlob = new Blob(audioChunks[i]);
        var audioUrl = URL.createObjectURL(audioBlob);
        var audio = new Audio(audioUrl);
        var play = () => audio.play();
        var pause = () => audio.pause();
        console.log("create audio blob F" + (i) + ":=(" + audioChunks[0].length + ":" + audioChunks[1].length + ":" + audioChunks[2].length + ")" );
        resolve({ audioBlob, audioUrl, audio, play, pause });
        //mediaRecorder.stop();
        console.log("mediaRecorder.stop();")
      });

    resolve({ start, stop, start_play });
  });

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const handleAction = async () => {
  var delay = document.getElementById("delay_dt").value;
  delay = (delay > 500) ? delay : 3000;

  const recorder = await recordAudio();
  const actionButton = document.getElementById('action');
  actionButton.disabled = true;
  
  //await sleep(delay);
  recorder.start();
  var audio = [];
  {
    await sleep(delay);
    audio.push( await recorder.stop());
    recorder.start();
    audio[gi].audio.play();
    gi ++;
  }


  while(playing){
    console.log("(" + gi + ") PLAY "+ playing);
    await sleep(delay);
    console.log("before stop");
    //await audio.pause()
    audio.push(await recorder.stop());
    console.log("before start");
    recorder.start();
    console.log("before play");
    audio[gi].play();
    gi ++;
  }

}
