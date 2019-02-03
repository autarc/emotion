// @flow
import React from 'react'
import { mq, colors, constants } from '../utils/style'
import Playground from '../components/Playground'
import * as markdownComponents from '../utils/markdown-styles'
import RenderHAST from '../components/RenderHAST'
import Title from '../components/Title'
import type { HASTRoot } from '../utils/types'
import Layout from '../layouts'
import { graphql } from 'gatsby'
import DocWrapper from '../components/DocWrapper'

type Props = {
  data: {
    doc: {
      htmlAst: HASTRoot,
      frontmatter: {
        title: string
      }
    },
    avatar: {
      childImageSharp: {
        resolutions: {
          src: string
        }
      }
    }
  },
  pageContext: {
    slug: string
  }
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function(event) {
    var hash = window.decodeURI(window.location.hash)
    if (hash !== '' && hash !== '#') {
      var element = document.getElementById(`.docSearch-content ${hash} a`)
      if (element) {
        // Wait for the browser to finish rendering before scrolling.
        setTimeout(function() {
          if (element) {
            element.click()
          }
        }, 0)
      }
    }
  })
}

const ClassName = (props: any) => {
  return props.children(props.className)
}

const LiveCode = props => (
  <ClassName
    css={mq({
      paddingTop: [8, 16],
      paddingRight: [8, 16],
      paddingBottom: [8, 16],
      paddingLeft: [8, 16]
    })}
  >
    {internalCodeStylesClassName => (
      <Playground
        css={mq({
          marginLeft: [0],
          marginRight: [0],
          marginTop: [24, 32],
          marginBottom: [24, 32],
          borderRadius: [0, 4],
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        })}
        editorClassName={internalCodeStylesClassName}
        initialCompiledCode={props.compiled}
        code={props.code}
      />
    )}
  </ClassName>
)

export default class DocRoute extends React.Component<Props> {
  render() {
    const { doc } = this.props.data
    return (
      <Layout>
        <DocWrapper>
          <div
            css={{
              // display: 'grid',
              // gridTemplateColumns: '1fr auto',
              // gridTemplateRows: 'auto 1fr',
              alignItems: 'center',
              gap: 8,
              maxWidth: '52em',
              margin: '0 auto',
              borderBottom: `1px solid ${colors.lighten(0.25, colors.border)}`
            }}
            className="docSearch-content"
          >
            <div css={{ display: 'flex', alignItems: 'center' }}>
              <markdownComponents.h1
                css={{
                  paddingTop: 0,
                  marginTop: constants.space[2],
                  marginBottom: constants.space[2],
                  color: colors.hightlight
                }}
              >
                {doc.frontmatter.title || this.props.pageContext.slug}
              </markdownComponents.h1>
              <markdownComponents.a
                css={{ fontSize: 12, marginLeft: 'auto' }}
                href={
                  doc.frontmatter.title
                    ? `https://github.com/emotion-js/emotion/edit/master/docs/${
                        this.props.pageContext.slug
                      }.md`
                    : `https://github.com/emotion-js/emotion/edit/master/packages/${
                        this.props.pageContext.slug
                      }/README.md`
                }
              >
                ✏️ <span css={{ marginLeft: 2 }}>Edit this page</span>
              </markdownComponents.a>
            </div>

            <div>
              <RenderHAST
                hast={doc.htmlAst}
                componentMap={{
                  'live-code': LiveCode,
                  ...markdownComponents
                }}
              />
            </div>
          </div>
        </DocWrapper>
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query DocBySlug($slug: String!) {
    doc: markdownRemark(fields: { slug: { eq: $slug } }) {
      htmlAst
      frontmatter {
        title
      }
    }
  }
`
