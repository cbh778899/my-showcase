import React, { useEffect, useRef, useState } from 'react';
import '../../styles/account/edit_avatar.css';
import { ArrowLeftCircleFill, ArrowRightCircleFill, CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';
import { calculateDefaultImageScale, validateMovement, validateScale } from '../../actions/calculator';
import { toast } from 'react-toastify';
import { updateDetailsAction } from '../../actions/account_actions';

function EditAvatar({display, close, id, requireUpdate, languagePack}) {
    const [avatarImgFile, selectImg] = useState(null);
    const [imgSrc, setImgSrc] = useState('');
    const [currPage, setCurrPage] = useState(1);
    const [canvasImgAttrs, setCanvasImgAttrs] = useState({
        img: null,
        x: 0, y: 0, width: 0, height: 0,
        mouse_down: false
    })

    const askAvatarBlock = useRef();
    const canvasRef = useRef();

    function uploadFile(evt) {
        if(evt.target.files.length) {
            const file = evt.target.files[0]
            if(imgSrc) URL.revokeObjectURL(imgSrc)
            if(file.type.indexOf('image/') === 0) {
                setImgSrc(URL.createObjectURL(file));
                selectImg(file);
            } else {
                toast.error(languagePack['file-type-invalid']);
                setImgSrc('');
                selectImg(null);
            }
        } else {
            setImgSrc('');
            selectImg(null);
        }
    }

    async function cleanUp() {
        close();
        await new Promise(s=>setTimeout(s, 700));
        imgSrc && URL.revokeObjectURL(imgSrc);
        setImgSrc('');
        selectImg(null);
        setCurrPage(1);
        setCanvasImgAttrs({
            img: null,
            x: 0, y: 0, width: 0, height: 0,
            mouse_down: false
        })
    }

    useEffect(()=>{
        if(currPage === 2) {
            const canvas = canvasRef.current
            const img = new Image();
            img.src = imgSrc;
            img.onload = () => {
                setCanvasImgAttrs({
                    img, ...calculateDefaultImageScale(
                        img.naturalWidth, img.naturalHeight,
                        canvas.width, canvas.height
                    )
                });
            }
        }
    // eslint-disable-next-line
    }, [currPage])

    function drawCanvas() {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const {img, x, y, width, height} = canvasImgAttrs
        ctx.drawImage(img, x, y, width, height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2*Math.PI)
            ctx.rect(canvas.width, 0, -canvas.width, canvas.height);
        ctx.fill();
    }

    function mouseDown(evt) {
        setCanvasImgAttrs({...canvasImgAttrs, mouse_down: true})
    }

    function mouseUp() {
        setCanvasImgAttrs({...canvasImgAttrs, mouse_down: false})
    }

    function mouseMove(evt) {
        if(canvasImgAttrs.mouse_down) {
            setCanvasImgAttrs({
                ...canvasImgAttrs,
                ...validateMovement(
                    canvasImgAttrs.x + evt.movementX, canvasImgAttrs.y + evt.movementY,
                    canvasImgAttrs.width, canvasImgAttrs.height,
                    canvasRef.current.width, canvasRef.current.height
                )
            })
        }
    }

    function wheelScroll(evt) {
        const scale = 1 + (evt.deltaY < 0 ? 0.1 : -0.1)
        setCanvasImgAttrs({
            ...canvasImgAttrs,
            ...validateScale(
                canvasImgAttrs.width * scale,
                canvasImgAttrs.height * scale,
                canvasImgAttrs.x * scale, canvasImgAttrs.y * scale,
                canvasRef.current.width, canvasRef.current.height
            )
        })
    }

    // eslint-disable-next-line
    useEffect(()=>{
        if(canvasImgAttrs.img) drawCanvas();
    // eslint-disable-next-line
    }, [canvasImgAttrs.x, canvasImgAttrs.y, canvasImgAttrs.width, canvasImgAttrs.height])

    function submitCroppedAvatar() {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const {img, x, y, width, height} = canvasImgAttrs
        ctx.drawImage(img, x, y, width, height);
        
        canvas.toBlob(blob=>{
            updateDetailsAction(id, { avatar: blob }, result=>{
                if(result) {
                    toast.success(languagePack['edit-avatar-success'])
                    cleanUp();
                    requireUpdate();
                } else {
                    toast.error(languagePack['upload-avatar-failed'])
                }
            })
        })
    }

    return (
        <div className={
            `upload-edit-avatar${
                display ? '' : ' hidden-upload-edit-avatar'
            }${currPage === 1 ? '' : ' page-2'}`}>
            <div className='page'>
                <input className='ask-avatar-input' type='file' accept='image/*' onChange={uploadFile}/>
                <div className='ask-avatar' ref={askAvatarBlock}>
                {
                    avatarImgFile ?
                    <img src={imgSrc} alt={languagePack['Preview not available']} /> :
                    <span>{languagePack['ask-select-avatar']}</span>
                }
                </div>
                <div className={`btn next${avatarImgFile ? '' : ' disabled-btn'}`}
                    onClick={()=>{ if(avatarImgFile) setCurrPage(2)}}
                >
                    <ArrowRightCircleFill className='icon' />
                    <span>{ languagePack['Next'] }</span>
                </div>
                <div className='btn cancel' onClick={cleanUp}>
                    <XCircleFill className='icon' />
                    <span>{ languagePack['Cancel'] }</span>
                </div>
            </div>
            <div className='page'>
                <canvas ref={canvasRef} width={400} height={400}
                    onMouseDown={mouseDown} onMouseUp={mouseUp}
                    onMouseMove={mouseMove} onMouseLeave={mouseUp}
                    onWheel={wheelScroll}
                ></canvas>
                <div className='btn next' onClick={submitCroppedAvatar}>
                    <CheckCircleFill className='icon' />
                    <span>{ languagePack['Finished'] }</span>
                </div>
                <div className='btn go-back' onClick={()=>setCurrPage(1)}>
                    <ArrowLeftCircleFill className='icon' />
                    <span>{ languagePack['Go Back'] }</span>
                </div>
                <div className='btn cancel' onClick={cleanUp}>
                    <XCircleFill className='icon' />
                    <span>{ languagePack['Cancel'] }</span>
                </div>
            </div>
        </div>
    );
}

export default EditAvatar;