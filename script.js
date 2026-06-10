// Music Player App
class MusicPlayer {
    constructor() {
        this.playlist = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.isShuffle = false;
        this.repeatMode = 0; // 0: no repeat, 1: repeat all, 2: repeat one
        this.volume = 70;

        this.initElements();
        this.attachEventListeners();
        this.loadSamplePlaylist();
    }

    initElements() {
        this.audio = document.getElementById('audioPlayer');
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.repeatBtn = document.getElementById('repeatBtn');
        this.progressInput = document.getElementById('progressInput');
        this.volumeControl = document.getElementById('volumeControl');
        this.playlistContainer = document.getElementById('playlist');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.fileInput = document.getElementById('fileInput');
        this.albumArt = document.getElementById('albumArt');
        this.songTitle = document.getElementById('songTitle');
        this.artistName = document.getElementById('artistName');
        this.currentTimeEl = document.getElementById('currentTime');
        this.durationEl = document.getElementById('duration');
    }

    attachEventListeners() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.previousSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        this.progressInput.addEventListener('change', (e) => this.seek(e.target.value));
        this.volumeControl.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.uploadBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.uploadFiles(e));

        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
    }

    // Load sample playlist (default songs)
    loadSamplePlaylist() {
        const sampleSongs = [
            {
                title: 'Midnight Dreams',
                artist: 'Ambient Music',
                url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop'
            },
            {
                title: 'Neon Lights',
                artist: 'Electronic',
                url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop'
            },
            {
                title: 'Sunset Vibes',
                artist: 'Lo-Fi Hip Hop',
                url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
                cover: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=500&fit=crop'
            },
            {
                title: 'Ocean Waves',
                artist: 'Chillwave',
                url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
                cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=500&fit=crop'
            },
            {
                title: 'Digital Paradise',
                artist: 'Synthwave',
                url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
                cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=500&fit=crop'
            }
        ];

        this.playlist = sampleSongs;
        this.renderPlaylist();
    }

    // Upload music files
    uploadFiles(e) {
        const files = e.target.files;
        for (let file of files) {
            const url = URL.createObjectURL(file);
            const song = {
                title: file.name.replace(/\.[^/.]+$/, ""),
                artist: 'Uploaded Song',
                url: url,
                cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=500&fit=crop'
            };
            this.playlist.push(song);
        }
        this.renderPlaylist();
        this.fileInput.value = '';
    }

    // Toggle play/pause
    togglePlay() {
        if (this.playlist.length === 0) {
            alert('No songs in playlist');
            return;
        }

        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        } else {
            if (this.audio.src === '') {
                this.loadSong(this.currentIndex);
            }
            this.audio.play().catch(error => {
                console.log('Playback error:', error);
                alert('Unable to play audio. Check browser permissions.');
            });
            this.isPlaying = true;
        }

        this.updatePlayButton();
    }

    // Load song
    loadSong(index) {
        const song = this.playlist[index];
        this.audio.src = song.url;
        this.songTitle.textContent = song.title;
        this.artistName.textContent = song.artist;
        this.albumArt.src = song.cover;
        this.albumArt.onerror = () => {
            this.albumArt.src = 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=500&fit=crop';
        };
        this.currentIndex = index;
        this.updatePlaylist();
    }

    // Play next song
    nextSong() {
        if (this.playlist.length === 0) return;

        if (this.isShuffle) {
            this.currentIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        }

        this.loadSong(this.currentIndex);
        if (this.isPlaying) {
            this.audio.play().catch(error => console.log('Playback error:', error));
        }
    }

    // Play previous song
    previousSong() {
        if (this.playlist.length === 0) return;

        this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadSong(this.currentIndex);
        if (this.isPlaying) {
            this.audio.play().catch(error => console.log('Playback error:', error));
        }
    }

    // Toggle shuffle
    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.shuffleBtn.classList.toggle('active', this.isShuffle);
    }

    // Toggle repeat
    toggleRepeat() {
        this.repeatMode = (this.repeatMode + 1) % 3;
        this.repeatBtn.classList.toggle('active', this.repeatMode > 0);

        if (this.repeatMode === 0) {
            this.repeatBtn.title = 'Repeat: Off';
        } else if (this.repeatMode === 1) {
            this.repeatBtn.title = 'Repeat: All';
        } else {
            this.repeatBtn.title = 'Repeat: One';
        }
    }

    // Handle song end
    handleSongEnd() {
        if (this.repeatMode === 2) {
            // Repeat one
            this.audio.currentTime = 0;
            this.audio.play().catch(error => console.log('Playback error:', error));
        } else {
            this.nextSong();
            if (this.isPlaying) {
                this.audio.play().catch(error => console.log('Playback error:', error));
            }
        }
    }

    // Update progress bar
    updateProgress() {
        if (this.audio.duration) {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressInput.value = percent;
            document.getElementById('progress').style.width = percent + '%';
            this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        }
    }

    // Seek to position
    seek(percent) {
        if (this.audio.duration) {
            this.audio.currentTime = (percent / 100) * this.audio.duration;
        }
    }

    // Update duration
    updateDuration() {
        this.durationEl.textContent = this.formatTime(this.audio.duration);
        this.progressInput.max = 100;
    }

    // Set volume
    setVolume(vol) {
        this.volume = vol;
        this.audio.volume = vol / 100;
    }

    // Format time (mm:ss)
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Update play button
    updatePlayButton() {
        const icon = this.isPlaying ? 'fa-pause' : 'fa-play';
        this.playBtn.innerHTML = `<i class="fas ${icon}"></i>`;
        
        if (this.isPlaying) {
            this.albumArt.style.animationPlayState = 'running';
        } else {
            this.albumArt.style.animationPlayState = 'paused';
        }
    }

    // Render playlist
    renderPlaylist() {
        this.playlistContainer.innerHTML = '';
        this.playlist.forEach((song, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.innerHTML = `<i class="fas fa-music"></i> <span>${song.title}</span>`;
            item.addEventListener('click', () => {
                this.loadSong(index);
                this.isPlaying = false;
                this.togglePlay();
            });
            this.playlistContainer.appendChild(item);
        });
        this.updatePlaylist();
    }

    // Update active playlist item
    updatePlaylist() {
        const items = document.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
        });
    }
}

// Initialize music player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});