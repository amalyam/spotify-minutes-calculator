import fs from "fs";
import StreamingHistory from "./src/streaminghistory-interface";

class SpotifyCalculator {
  constructor(public dirname: string) {}

  async getFiles(dirname: string): Promise<StreamingHistory[]> {
    const filenames: string[] = await fs.promises.readdir(dirname);

    const streamingHistoryPromises = filenames.map(
      async (fileName: string): Promise<StreamingHistory[]> =>
        JSON.parse(
          await fs.promises.readFile(`./streaming-history/${fileName}`, "utf8")
        )
    );

    return (await Promise.all(streamingHistoryPromises)).flat();
  }

  getTotalMs(streamingHistory: StreamingHistory[]): number {
    return streamingHistory.reduce(
      (totalMs, track) => totalMs + track.msPlayed,
      0
    );
  }

  convertTime(totalMsPlayed: number): number {
    return Math.floor(totalMsPlayed / 60000);
  }

  displayResults(minutes: number) {
    console.log(
      `You spent ${minutes} minutes streaming on Spotify in the last year!`
    );
  }

  async execute() {
    const streamingHistory = await this.getFiles(this.dirname);
    const totalMs = this.getTotalMs(streamingHistory);
    let totalMin = this.convertTime(totalMs);
    this.displayResults(totalMin);
  }
}

const newSpotifyCalculator = new SpotifyCalculator("streaming-history");
newSpotifyCalculator.execute();
