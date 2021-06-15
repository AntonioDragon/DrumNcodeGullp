
let project_folder ="./dist"
let sourse_folder ="./src"

let path={
    build:{
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img-icons/",
        fonts: project_folder + "/fonts/",
    },
    src:{
        html: sourse_folder + "/*.html",
        css: sourse_folder + "/scss/*.scss",
        js: sourse_folder + "/js/",
        img: sourse_folder + "/img-icons/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: sourse_folder + "/fonts/*.ttf",
    },
    watch:{
        html: sourse_folder + "/**/*.html",
        css: sourse_folder + "/scss/**/*.scss",
        js: sourse_folder + "/js/**/*.js",
        img: sourse_folder + "/img-icons/**/*.{jpg,png,svg,ico,webp}",
    },
    clean: "./" + project_folder + "/"
}

let { src , dest } = require("gulp"),
    gulp = require("gulp"),
    browsersync = require("browser-sync").create(),
    fileinclude = require("gulp-file-include"),
    del = require("del"),
    scss = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    group_media = require("gulp-group-css-media-queries");

function browserSync(){
    browsersync.init({
        server:{
            baseDir: "./" + project_folder + "/"
        },
        port:3000,
        notify: false
    })
}

function html(){
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle:"expanded"
            })
        )
        .pipe(
            group_media()
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 version"],
                cascade: true
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js(){
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function images(){
    return src(path.src.img)
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function watchFiles(){
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean() {
    return del(path.clean)
}


//tusk параллельной сборки проекта 
let build = gulp.series(clean,gulp.parallel(js, css, html, images));
//tusk сборки,отслеживание проекта и создание сервера 
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;