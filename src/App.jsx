import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';

import './App.css'
import { useState } from 'react'
import { useRef } from 'react';

import { MdAdd } from "react-icons/md";
import { AiFillPicture } from "react-icons/ai";
import { FaVideo } from "react-icons/fa6";
import { TbSocial } from "react-icons/tb";
import { IoClose } from "react-icons/io5";


function App() {
  const [value, setValue] = useState()
  const [youtubeUrl, setUrl] = useState('')
  const [showDropdown, setShow] = useState(false)
  const [showPicModal, setPicModal] = useState(false)
  const [showVideoModal, setVideoModal] = useState(false)

  const quillRef = useRef(null);
  const fileInputRef = useRef(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ]

  const handleChange = (content) => {
    setValue(content);
  };

  const handleInsertImage = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (event) => {
    
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        // console.log('i am here2', range)
        // quill.insertEmbed(range.index, 'image', e.target.result);
        // console.log('i am here3')
        // quill.setSelection(range.index + 1); // Move the cursor after the image
        // console.log('i am here 4')

        if (range) {
          quill.insertEmbed(range.index, 'image', e.target.result);
          quill.setSelection(range.index + 1); // Move the cursor after the image
        } else {
          // If no selection exists, insert at the end
          quill.insertEmbed(quill.getLength(), 'image', e.target.result);
        }
      };
      reader.readAsDataURL(file);
      setPicModal(false)
    }

  };

  const handleInsertYouTube = () => {
    setVideoModal(false)
    if (youtubeUrl) {
     
      const videoId = getYouTubeVideoId(youtubeUrl);
      if (videoId) {
       
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        if (range) {
          
          quill.insertEmbed(range.index, 'video', embedUrl);
          quill.setSelection(range.index + 1); // Move the cursor after the embed
        } else {
          
          // If no selection exists, insert at the end
          quill.insertEmbed(quill.getLength(), 'video', embedUrl);
        }
      } else {
        alert('Invalid YouTube URL');
      }
    }else{
      alert('No URL Inserted');
    }
  };


  const getYouTubeVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
  };


 

  return (
    <div className='container'>
      <div className='inner-wrap'>
        <div className='editor-wrap'>

          <div className='top-box'></div>
          <div className='editor'>
            <div className='post-title'>
              <input className='title-input' placeholder='Add post title' />
            </div>
            <div className='post-content'>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
              <ReactQuill 
             
              value={value} 
              onChange={handleChange}
              className='editor-input'
              ref={quillRef}
              modules={modules}
              formats={formats}
              //modules={{ toolbar: false }}
              />
              <div className='drop-down-wrap'>
                <div className='add-icon' onClick={()=>setShow(!showDropdown)}>
                  <MdAdd />
                </div>
               {showDropdown && <div className='dropdown'>
                  <p className='dropdown-heading'>EMBEDS</p>
                  <div className='dropdown-item' onClick={()=> {setPicModal(true); setShow(false) }}>
                    <span><AiFillPicture /></span>
                    <div className='media-type'>
                      <p className='media-txt'>Picture</p>
                      <p className='format'>jpeg, png</p>
                    </div>
                  </div>
                  <div className='dropdown-item' onClick={()=> {setVideoModal(true); setShow(false) }}>
                    <span><FaVideo /></span>
                    <div className='media-type'>
                      <p className='media-txt'>Video</p>
                      <p className='format'>JW player, Youtube, Vimeo</p>
                    </div>
                  </div>
                  <div className='dropdown-item'>
                    <span><TbSocial /></span>
                    <div className='media-type'>
                      <p className='media-txt'>Social</p>
                      <p className='format'>Instagram, Twitter, Tiktok, Snapchat, Facebook</p>
                    </div>
                  </div>
                </div>}
              </div>
            </div>
          </div>
        </div>
        <div className='post-btn-wrap'>
          <button>Post</button>
        </div>
      </div>

      {showPicModal && <div className='modal'>

        <div className='modal-content'>
          <div className='modal-title'>
            <p className='embed-txt'>Embed</p>
            <span className='close-modal' onClick={()=>setPicModal(false)}><IoClose /></span>
          </div>
          <h3 className='modal-desc'>Upload Image</h3>

          <p className='modal-desc2'>FILE UPLOAD</p>

          <div className='upload-area'>
              <button className='import-btn' onClick={handleInsertImage}>Import Image from Device</button>
              
          </div>

          <div className='btns-wrap'>
            <button className='embed-btn'>Embed</button>
            <button className='cancel-btn'>Cancel</button>
          </div>

        </div>

      </div>}
      {showVideoModal && <div className='modal'>

        <div className='modal-content'>
          <div className='modal-title'>
            <p className='embed-txt'>Embed</p>
            <span className='close-modal' onClick={()=>setVideoModal(false)}><IoClose /></span>
          </div>

          <div className='video-details'>
            <p className='provider-txt'>VIDEO PROVIDER</p>
            <div className='video-chanel'>Youtube</div>

            <div className='video-url'>
              <p>URL</p>
              <input onChange={(e)=> setUrl(e.target.value)}/>
            </div>
          </div>

          

          <div className='btns-wrap'>
            <button className='embed-btn' onClick={handleInsertYouTube}>Embed</button>
            <button className='cancel-btn'>Cancel</button>
          </div>

        </div>

      </div>}
      


    </div>
  )
}

export default App
