import fs from "fs";
import StreamingHistory from "./src/streaminghistory-interface";

class SpotifyCalculator {
  constructor(public dirname: string) {}
  public minutes: number = 0;

  async getFiles(dirname: string): Promise<StreamingHistory[]> {
    const filenames: string[] = await fs.promises.readdir(dirname);

    let streamingHistory: StreamingHistory[] = [];
    await Promise.all(
      filenames.map(async (fileName: string) => {
        streamingHistory.push(
          ...JSON.parse(
            await fs.promises.readFile(
              `./streaming-history/${fileName}`,
              "utf8"
            )
          )
        );
      })
    );
    return streamingHistory;
  }

  getTotalMs(streamingHistory: StreamingHistory[]) {
    return streamingHistory.reduce(
      (totalMs, track) => totalMs + track.msPlayed,
      0
    );
  }

  convertTime(totalMsPlayed: number) {
    if (totalMsPlayed > 0) {
      this.minutes = Math.floor(totalMsPlayed / 60000);
    }
  }

  displayResults() {
    console.log(
      `You spent ${this.minutes} minutes streaming on Spotify in the last year!`
    );
  }

  async execute() {
    const streamingHistory = await this.getFiles(this.dirname);
    const totalMs = this.getTotalMs(streamingHistory);
    this.convertTime(totalMs);
    this.displayResults();
  }
}

const newSpotifyCalculator = new SpotifyCalculator("streaming-history");
newSpotifyCalculator.execute();
