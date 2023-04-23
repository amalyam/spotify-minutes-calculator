import fs from "fs";
import StreamingHistory from "./src/streaminghistory-interface";

class SpotifyCalculator {
  constructor(_dirname: string) {}
  public streamingHistory: StreamingHistory[] = [];
  public totalMsPlayed: number = 0;
  public minutes: number = 0;

  getFiles(_dirname: string) {
    fs.readdir(_dirname, (err, files) => {
      if (err) console.log(err);
      else {
        files.forEach((file) => {
          this.streamingHistory.push(JSON.parse(file));
        });
      }
    });
    this.streamingHistory = this.streamingHistory.flat();
  }

  getTotalMs() {
    this.streamingHistory.forEach((track) => {
      this.totalMsPlayed += track.msPlayed;
    });
  }

  convertTime() {
    if (this.totalMsPlayed > 0) {
      this.minutes = Math.floor(this.totalMsPlayed / 60000);
    }
  }

  displayResults() {
    console.log(
      `You spent ${this.minutes} minutes streaming on Spotify in the last year!`
    );
  }

  execute() {
    this.getFiles(__dirname);
    this.getTotalMs();
    this.convertTime();
    this.displayResults();
  }
}
