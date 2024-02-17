<template>
  <div>
    <p v-if="maxDetailId">The maximum detail_id found is: {{ maxDetailId }}</p>
    <p v-else>No detail_id found in the links.</p>
    <p v-if="fullImageUrl">Full Image URL: {{ fullImageUrl }}</p>
    <p v-else>Image URL not found.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      maxDetailId: null,
      fullImageUrl: null
    };
  },
  mounted() {
    axios.get('https://www.knps.or.kr/front/portal/open/pnewsList.do?pnewsGrpCd=PNE01&menuNo=8000517&searchParkId=120400')
      .then(response => {
        if (response.status === 200) {
          const links = response.data.match(/<a[^>]+href="([^"]+)"/g);
          const numberPattern = /\d+/;

          links.forEach(link => {
            if (link.startsWith("javascript:goDetail")) {
              const detailId = link.split("'")[1];
              const numericPart = detailId.match(numberPattern);
              if (numericPart) {
                const detailIdNumber = parseInt(numericPart[0]);
                if (this.maxDetailId === null || detailIdNumber > this.maxDetailId) {
                  this.maxDetailId = detailIdNumber;
                }
              }
            }
          });

          if (this.maxDetailId !== null) {
            const detailUrl = `https://www.knps.or.kr/front/portal/open/pnewsDtl.do?menuNo=8000517&pnewsId=PNEWSM0${this.maxDetailId}`;
            axios.get(detailUrl)
              .then(detailResponse => {
                if (detailResponse.status === 200) {
                  const wrapperDivContent = detailResponse.data.match(/<div id="wrapper">(.*?)<\/div>/s);
                  if (wrapperDivContent) {
                    const wrapperDivLines = wrapperDivContent[1].split('\n');
                    wrapperDivLines.forEach(line => {
                      if (line.includes('txc-image')) {
                        const match = line.match(/src="([^"]+\.jpg)"/);
                        if (match) {
                          const imageUrl = match[1];
                          const baseUrl = "https://www.knps.or.kr/"; // Replace this with the actual base URL
                          this.fullImageUrl = baseUrl + imageUrl;
                        }
                      }
                    });
                  }
                } else {
                  console.error(`Failed to retrieve detail page for ${this.maxDetailId}`);
                }
              })
              .catch(error => {
                console.error(error);
              });
          } else {
            console.log("No detail_id found in the links.");
          }
        } else {
          console.error('Failed to retrieve the web page');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
};
</script>
