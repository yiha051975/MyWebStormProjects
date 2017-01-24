/**
 * Created by iti8218 on 1/19/2017.
 */
import React from 'react';

const VideoListItem = ({video, onVideoSelect}) => {
    const imageUrl = video.snippet.thumbnails.default.url;

    return (
        <li className="list-group-item" onClick={() => onVideoSelect(video)}>
            <div className="video-list media">
                <div className="media-left">
                    <img src={imageUrl} className="media-object" />
                </div>
                <div className="media-body">
                    <div className="media-heading">{video.snippet.title}</div>
                </div>
            </div>
        </li>
    );
};

export default VideoListItem;