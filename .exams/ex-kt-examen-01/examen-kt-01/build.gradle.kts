plugins {
    kotlin("jvm") version "2.1.0"
    application
}

group = "es.ies.pmdm.exams"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}

application {
    mainClass.set("app.MainKt")
}
