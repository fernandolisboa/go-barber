import * as SESMailProvider from "@shared/container/providers/MailProvider/implementations/SESMailProvider"

// @ponicode
describe("sendMail", () => {
    let inst: any

    beforeEach(() => {
        inst = new SESMailProvider.default({})
    })

    test("0", async () => {
        await inst.sendMail({ from: { name: "Jean-Philippe", email: "something.example.com" }, to: { name: "Jean-Philippe", email: "ponicode.com" }, subject: "A sub-message", templateData: { file: "navix377.py", variables: { key0: "Foo bar", key1: 100, key2: -100, key3: 100 } } })
    })

    test("1", async () => {
        await inst.sendMail({ from: { name: "Edmond", email: "TestUpperCase@Example.com" }, to: { name: "Edmond", email: "ponicode.com" }, subject: "Subject: %s", templateData: { file: "./data/population.csv", variables: { key0: "Hello, world!" } } })
    })

    test("2", async () => {
        await inst.sendMail({ from: { name: "George", email: "something@example.com" }, to: { name: "Anas", email: "TestUpperCase@Example.com" }, subject: "Error: Unknown URL", templateData: { file: "./data/population.csv", variables: { key0: "foo bar", key1: 100, key2: -5.48, key3: "Foo bar" } } })
    })

    test("3", async () => {
        await inst.sendMail({ from: { name: "Edmond", email: "bed-free@tutanota.de" }, to: { name: "Pierre Edouard", email: "user@host:300" }, subject: "dummy subject", templateData: { file: "libclang.dll", variables: { key0: "This is a Text", key1: 0, key2: 0, key3: "Hello, world!" } } })
    })

    test("4", async () => {
        await inst.sendMail({ from: { name: "Edmond", email: "email@Google.com" }, to: { name: "Anas", email: "user@host:300" }, subject: "dummy subject", templateData: { file: ":", variables: { key0: "Foo bar", key1: 100, key2: -100, key3: -5.48 } } })
    })

    test("5", async () => {
        await inst.sendMail({ from: { name: "", email: "" }, to: { name: "", email: "" }, subject: "", templateData: { file: "", variables: { key0: -Infinity, key1: -Infinity, key2: -Infinity, key3: "", key4: -Infinity } } })
    })
})
