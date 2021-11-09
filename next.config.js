module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/plan',
        permanent: false,
      },
    ]
  },
  swcMinify: true,
}
