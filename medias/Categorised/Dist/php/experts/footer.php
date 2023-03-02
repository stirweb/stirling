<section class="u-bg-heritage-green u-white--all" aria-label="Find-an-expert database summary">
    <div class="grid-container medium-10 medium-centered columns">
        <div class="grid-x grid-padding-x">
            <div class="cell small-10 medium-8 c-facts">
                <p class="c-facts__heading">Experts</p>
                <p>There are <a href="<?=$browseByName?>"><?=$totalExperts?> experts</a> across <a href="<?=$browseByTopic?>"><?=$totalTopics?> specialisms</a> in our online database.</p>
                <?php echo empty($more) ? '' : $more; ?>
            </div>
        </div>
    </div>
</section>
