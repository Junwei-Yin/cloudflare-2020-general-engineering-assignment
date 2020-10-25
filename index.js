
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})


const urls = [{"name": "Random variable", "url": "https://worked-random.junweiy.workers.dev/"},
  {"name": "FSE project", "url": "ttps://f19-esn-sa5.herokuapp.com/"},
  {"name": "YouTube Demo", "url": "https://www.youtube.com/watch?v=AAe4Y9A881A"}]

const socialUrls = [
  {"url": "https://www.facebook.com/junwei.yin.1/", "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z\"/></svg>"},
  {"url": "https://github.com/Junwei-Yin", "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 6c-3.313 0-6 2.686-6 6 0 2.651 1.719 4.9 4.104 5.693.3.056.396-.13.396-.289v-1.117c-1.669.363-2.017-.707-2.017-.707-.272-.693-.666-.878-.666-.878-.544-.373.041-.365.041-.365.603.042.92.619.92.619.535.917 1.403.652 1.746.499.054-.388.209-.652.381-.802-1.333-.152-2.733-.667-2.733-2.965 0-.655.234-1.19.618-1.61-.062-.153-.268-.764.058-1.59 0 0 .504-.161 1.65.615.479-.133.992-.199 1.502-.202.51.002 1.023.069 1.503.202 1.146-.776 1.648-.615 1.648-.615.327.826.121 1.437.06 1.588.385.42.617.955.617 1.61 0 2.305-1.404 2.812-2.74 2.96.216.186.412.551.412 1.111v1.646c0 .16.096.347.4.288 2.383-.793 4.1-3.041 4.1-5.691 0-3.314-2.687-6-6-6z\"/></svg>"},
  {"url": "https://www.linkedin.com/in/junwei-yin/", "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z\"/></svg>"}
  ]

const gitHubAvatar = "https://avatars1.githubusercontent.com/u/54735715?v=4"

const gitHubUserName = "Junwei-Yin"

const name = "Junwei Yin"

const color = "bg-gray-100"

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {

  const url = new URL(request.url)
  const linkPath = "/link"
  let requestPath = url.pathname;

  if (requestPath === linkPath) {
    return await getUrls()
  }

  else {
    return await getHTML()
  }
}


async function getUrls() {

  const data = {urls: urls}
  return new Response(JSON.stringify(data, null, 2), {
    headers: {'content-type': 'application/json;charset=UTF-8'},
  })
}


async function getHTML() {
  let html = await fetch('https://static-links-page.signalnerve.workers.dev')
  return new HTMLRewriter()
    .on("div#links", new LinksTransformer(urls))
    .on("div#profile, div#profile > img, div#profile > h1", new ProfileTransformer(gitHubAvatar, gitHubUserName))
    .on("div#social", new SocialTransformer(socialUrls))
    .on("title", new HeaderTitleTransformer(name))
    .on("body", new BackgroundColorTransformer(color))
    .transform(html)
}


class LinksTransformer {
  constructor(links) {
    this.links = links
  }

  async element(element) {
    this.links.forEach( (link) => {
      element.append(`<a href="${link.url}">${link.name}</a>`, {html: true})
    })
  }
}


class ProfileTransformer {
  constructor(avatar, name) {
    this.avatar = avatar
    this.name = name
  }

  async element(element) {
    if (element["tagName"] === "div") {
      element.removeAttribute("style")
    }

    if (element["tagName"] === "img") {
      element.setAttribute("src", this.avatar)
    }

    if (element["tagName"] === "h1") {
      element.append(`${this.name}`)
    }
  }
}


class SocialTransformer {
  constructor(socialLinks) {
    this.socialLinks = socialLinks
  }

  async element(element) {
    element.removeAttribute("style")
    this.socialLinks.forEach( (link) => {
      element.append(`<a href="${link.url}">${link.svg}</a>`, {html: true})
    })
  }
}

class HeaderTitleTransformer {
  constructor(name) {
    this.name = name
  }

  async element(element) {
    element.setInnerContent(this.name)
  }
}


class BackgroundColorTransformer {
  constructor(color) {
    this.color = color
  }

  async element(element) {
    element.setAttribute("class", this.color)
  }
}

