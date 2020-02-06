let gulp = require(`gulp`);
let sass = require(`gulp-sass`);
let csso = require(`postcss-csso`);
let notify = require(`gulp-notify`);
let plumber = require(`gulp-plumber`);
let webpack = require(`webpack`);
let postcss = require(`gulp-postcss`);
let sourcemaps = require(`gulp-sourcemaps`);
let autoprefixer = require(`autoprefixer`);
let webpackStream = require(`webpack-stream`);
let del = require(`del`);
let njkRender = require(`gulp-nunjucks-render`);
let prettify = require(`gulp-html-prettify`);
let browserSync = require(`browser-sync`).create();

const sourceDir = `source/`;
const publicDir = `public/`;

handler = (err, stats) => {

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.warn(info.errors);
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }
};

gulp.task(`server`, () => {

  browserSync.init({
    server: {
      baseDir: publicDir
    },
    files: [
      publicDir + `/**/*`
    ],
    port: 8080,
  });

  gulp.watch([sourceDir + `templates/**/*.html`], gulp.parallel(`nunjucks`));
  gulp.watch([sourceDir + `img/**/*.*`], gulp.parallel(`imageSync`));
  gulp.watch([sourceDir + `sass/**/*.scss`], gulp.parallel(`sass`));
  gulp.watch([sourceDir + `fonts/**/*`], gulp.parallel(`fontSync`));
  gulp.watch([sourceDir + `js/**/*.js`], gulp.parallel(`scripts`));
});

gulp.task(`sass`, () => gulp
  .src([sourceDir + `sass/style.scss`])
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: `expanded`, // nested, expanded, compact, compressed
    precision: 5
  }))
  .on(`error`, notify.onError({
    message: `<%= error.message %>`,
    title: `Sass Error!`
  }))
  .pipe(postcss([
    autoprefixer({
      cascade: false
    }),
    csso
  ]))
  .pipe(sourcemaps.write(`./`))
  .pipe(gulp.dest(publicDir + `css/`))
);

gulp.task(`sassBuild`, () => gulp
  .src([sourceDir + `sass/style.scss`])
  .pipe(sass({
    outputStyle: `compressed`,
    precision: 5
  }))
  .pipe(postcss([
    autoprefixer({
      cascade: false
    }),
    csso
  ]))
  .pipe(gulp.dest(publicDir + `css/`))
);

gulp.task(`imageSync`, () => gulp
  .src([sourceDir + `img/**/*.*`])
  .pipe(gulp.dest(publicDir + `img/`))
);

gulp.task(`fontSync`, () => gulp
  .src(sourceDir + `fonts/**/*`)
  .pipe(gulp.dest(publicDir + `fonts/`))
);

gulp.task(`scripts`, () => gulp
  .src([sourceDir + `js/app.js`])
  .pipe(webpackStream({
    mode: `production`,
    output: {
      filename: `app.js`,
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /(node_modules)/,
          loader: `babel-loader`,
          query: {
            presets: [`env`]
          }
        }
      ]
    },
    externals: {
      jquery: `jQuery`
    }
  },
  null,
  handler
  ))
  .pipe(gulp.dest(publicDir + `js/`))
);

gulp.task(`nunjucks`, () => gulp
  .src([sourceDir + `templates/**/[^_]*.html`])
  .pipe(njkRender({
    path: [sourceDir + `/templates`]
  }))
  .pipe(prettify({
    // eslint-disable-next-line camelcase
    indent_size: 2
  }))
  .pipe(gulp.dest(publicDir))
);

gulp.task(`clean`, () => {
  return del([publicDir]);
});

gulp.task(`build`, gulp.series(`clean`, `sassBuild`, `scripts`, `nunjucks`, `imageSync`, `fontSync`));
gulp.task(`build:dev`, gulp.series(`clean`, `sass`, `scripts`, `nunjucks`, `imageSync`, `fontSync`));
gulp.task(`default`, gulp.series(`build:dev`, `server`));
