QUnit.module('stir', function() {
	QUnit.test('capitaliseFirst', function(assert) {
		assert.equal(stir.capitaliseFirst('robert'),"Robert","Change the first character of a string to upper case.");
	});
	QUnit.test('fileSize', function(assert) {
		assert.equal(stir.Math.fileSize(10000),"9.77kB");
	});
	QUnit.test('htmlEntities', function(assert) {
		assert.equal(stir.String.htmlEntities(`'">&lt;<script></script>`),"&#39;&quot;&gt;&amp;lt;&lt;script&gt;&lt;&#x2F;script&gt;");
	});
});