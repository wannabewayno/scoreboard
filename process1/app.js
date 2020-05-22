const { Image } = require('image-js'); //image processing library
const { createWorker, createScheduler } = require('tesseract.js'); //OCR image to text library
const { performance } = require("perf_hooks"); // performance hooks
const util = require('util');
const getPixels = require('get-pixels');
const path = require('path');
// const { average } = require('./lib/post-processing.js');

let t0 = 0;
let t1 = 0;

gamerTag = ['killahhh.-Â\00BB',`seb008-seacow`,`[[Reaper]]`,`Poo|ToeKnee`,`Invictus`,`davemck89`,`|.:|Zio Matrix`,`darkraider`,`Icefyre`,`>TG< BloodSplat`,`xTwilightDawnx`,`da_moletrix`];
bestValue = [(8/12)*100,0,0.35];
const average = image => {
    const sum = image.data.reduce((a,b) => a + b, 0);
    const average = sum/image.data.length;
    return average;
}

const thresholdA = (image,threshold) => {
    const channels = image.channels;
    image.data = image.data.map((pixel,index) => {
      if(pixel < threshold && ((index+1)/channels)%1!==0){
          return 0;
      } else {
          return pixel;
      }
    });
    return image;
}

function comparison(Real,Generated){
    const resultString = Generated;
    count = 0;
    Real.forEach(real => {
        if(resultString.indexOf(real)!==-1){
            count++;
        }
    });
    comparisonScore = count/Real.length*100;
    return comparisonScore;
}

let threshCount = 7;
let globalthresh = 0.34;

const analyse = async () =>{
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(path.join(__dirname,`output.png`));
    if(text.indexOf(`[[Reaper]]`) !==-1){
        console.log("MATCH!!!!")
    }
    console.log(text);
    await worker.terminate();
    t1 = performance.now();
    console.log(`Processed in ${Math.round((t1-t0)/1000)} Seconds`);

    const score = [];
    score.push(comparison(gamerTag,text));
    score.push(threshCount);
    score.push(globalthresh);
    if (score[0]>bestValue[0]){
       for (let i = 0; i < score.length; i++) {
           bestValue[i] = score[i]
       }
    }
    console.log(bestValue);
    // console.log(util.inspect(allScores,{maxArrayLength:null}));


    if (threshCount < 255 ) {
        if (globalthresh >= 1){
            globalthresh = 0;
            threshCount ++;
        }
        globalthresh+=0.01;
        console.log(threshCount,globalthresh);
        Main(threshCount,globalthresh);
    }
   
}


async function Main(threshCount,globalthresh) {
t0 = performance.now();
// Load in an image
Image.load('./SB2cropped.png')
//returns a promise
.then(image=>{
    let index = 0;

    console.log(average(image));

    index++;
    image = thresholdA(image,threshCount); // threshold pixels under the threshold limit to black
    // image.save(`./output/${index}threshold.png`);

    console.log(average(image));

    // index++;
    // image = image.blurFilter(); //blur filter
    // image.save(`./output/${index}blur.png`)
    
    // index++;
    // image = image.gaussianFilter(); //guassian blur filter
    // image.save(`./output/${index}guassian.png`)

    index++;
    image = image.grey({keepAlpha:true}); // grey image
    // image.save(`./output/${index}grey.png`);

    console.log(average(image));

    // image = image.topHat(); // apply top hat filter
    // image.save(`./output/${index}topHat.png`);
    // index++;
    
    index++;
    image = image.mask({algorithm:'threshold',threshold:globalthresh,useAlpha:true,invert:true}); //binary mask
    // image.save(`./output/${index}mask.png`) 

    console.log(average(image));

    // image = image.rgba8();
    // image.save(`./output/${index}rgba8.png`) // rgb image from a binary mask
    // index++;
   
    // image = image.grey({keepAlpha:true}); // grey image
    // image.save(`./output/${index}grey.png`);
    // index++;

    // index++;
    // image = image.gaussianFilter(); //guassian blur filter
    // image.save(`./output/${index}guassian.png`)

    // image = image.sobelFilter(); //sobel filter
    // image.save(`./output/${index}sobel.png`)
    // index++;

    // image = image.cannyEdge(); //sobel filter
    // image.save(`./output/${index}sobel.png`)
    // index++;

    // image = threshold(image,90); // threshold pixels under 80 to black
    // image.save(`./output/${index}threshold.png`);
    // index++;
    // console.log(image.data);

    // image = image.mask({algorithm:'threshold',threshold:0.1,useAlpha:false,invert:true}); //binary mask
    // image.save(`./output/${index}mask.png`) // thresholded image
    // index++;
    
    // image = image.blurFilter(); //blur filter
    // image.save(`./output/${index}blur.png`)
    // index++;

    // image = image.grey({keepAlpha:false}); // grey image
    // image.save(`./output/${index}grey.png`);
    // index++;

    // image = image.dilate(); // dilate image
    // image.save(`./output/${index}dilate.png`);
    // index++;

    // image = image.erode(); // erode image
    // image.save(`./output/${index}erode.png`);
    // index++;
    
    image.save(path.join(__dirname,`output.png`)); //
    console.log(`Image successfully processed`);
})
.finally(result=> analyse())
}

Main(threshCount,globalthresh);
// analyse();


  // image = threshold(image,80); // threshold pixels under 80 to black
    // image.save(`./output/${index}threshold.png`);
    // index++;

    // image = image.topHat(); // apply top hat filter
    // image.save(`./output/${index}topHat.png`);
    // index++;

    // let count = 1
    // const interval = image.width*image.channels;
    // for (let i = 0; i < (image.width*image.height*image.channels)-interval; i+=interval) {
    //     count++;
    //     console.log(image.data.slice(i,i+interval));
    // }